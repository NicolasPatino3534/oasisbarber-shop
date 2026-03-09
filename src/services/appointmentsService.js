/**
 * appointmentsService.js
 *
 * Capa de acceso a datos: toda la lógica de Firestore vive aquí.
 * Los componentes y hooks NUNCA importan firebase/firestore directamente,
 * solo importan estas funciones — así la UI queda desacoplada del backend.
 *
 * Colección Firestore: `turnos`
 * Estructura de cada documento:
 * {
 *   professionalId:   string,     // 'mateo' | 'lucas' | 'valentina'
 *   professionalName: string,     // 'Mateo'
 *   serviceId:        string,     // 'classic-cut'
 *   serviceName:      string,     // 'Corte Clásico'
 *   servicePrice:     number,     // 15
 *   serviceIcon:      string,     // '✂️'
 *   date:             string,     // 'YYYY-MM-DD'  ← formato fijo para queries
 *   time:             string,     // 'HH:00'
 *   clientName:       string,
 *   createdAt:        Timestamp,  // serverTimestamp()
 * }
 *
 * ID del documento: `{professionalId}_{date}_{time}`
 *   → Actúa como unique constraint: si dos clientes intentan reservar el mismo
 *     slot simultáneamente, la transacción del segundo falla limpiamente.
 */

import {
  collection,
  doc,
  query,
  where,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.js';

const COLLECTION = 'turnos';

// ─── Suscripción en tiempo real ───────────────────────────────────────────────

/**
 * Abre un listener en tiempo real sobre los turnos de un profesional en una fecha.
 * Cada vez que se agrega/elimina un turno en Firestore, `onUpdate` recibe
 * un Set actualizado con los horarios ocupados (ej: Set{'10:00', '14:00'}).
 *
 * @param {string}   professionalId  - ID del profesional
 * @param {string}   date            - Fecha en formato 'YYYY-MM-DD'
 * @param {Function} onUpdate        - Callback que recibe el Set de horas ocupadas
 * @param {Function} onError         - Callback de error
 * @returns {Function} unsubscribe   - Llamar en el cleanup del useEffect
 */
export function subscribeToBookedSlots(professionalId, date, onUpdate, onError) {
  const q = query(
    collection(db, COLLECTION),
    where('professionalId', '==', professionalId),
    where('date', '==', date),
  );

  // onSnapshot retorna la función de cleanup directamente
  return onSnapshot(
    q,
    (snapshot) => {
      const booked = snapshot.docs.map((d) => ({
        time:     d.data().time,
        duration: d.data().serviceDuration || 60,
      }));
      onUpdate(booked);
    },
    (error) => {
      console.error('[Firestore] Error en listener de horarios:', error);
      onError?.(error);
    },
  );
}

// ─── Escritura con transacción atómica ───────────────────────────────────────

/**
 * Guarda un nuevo turno en Firestore usando una transacción.
 *
 * ANTI-CONFLICTO: El ID del documento es `{professionalId}_{date}_{time}`.
 * Dentro de la transacción:
 *   1. Se lee el documento con ese ID.
 *   2. Si ya existe → se lanza un error (el turno fue tomado en el último segundo).
 *   3. Si no existe → se escribe el documento.
 * Todo en una operación atómica: imposible que dos clientes guarden el mismo slot.
 *
 * @param {object} data - Datos del turno (ver estructura arriba)
 * @returns {Promise<{id: string, ...data}>} El turno guardado con su ID
 * @throws {Error} Si el slot ya está ocupado o hay un error de red
 */
export async function createAppointment(data) {
  // ID determinístico = unique constraint sin índice adicional
  const docId = `${data.professionalId}_${data.date}_${data.time}`;
  const docRef = doc(db, COLLECTION, docId);

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(docRef);

    if (existing.exists()) {
      // Otro cliente tomó este slot entre que el usuario vio la pantalla y confirmó
      throw new Error(
        'Este turno acaba de ser reservado por otra persona. Por favor elegí otro horario.',
      );
    }

    transaction.set(docRef, {
      ...data,
      createdAt: serverTimestamp(), // timestamp del servidor, no del cliente
    });
  });

  return { id: docId, ...data };
}

// ─── Admin: todos los turnos en tiempo real ───────────────────────────────────

/**
 * Suscripción en tiempo real a la colección completa de turnos.
 * Ordena el resultado por fecha y horario en el cliente para evitar
 * índices compuestos adicionales en Firestore.
 *
 * @param {Function} onUpdate  - Callback con array de turnos ordenados
 * @param {Function} onError   - Callback de error
 * @returns {Function}         - Función de cleanup para useEffect
 */
export function subscribeToAllAppointments(onUpdate, onError) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, '0')}-${String(cutoff.getDate()).padStart(2, '0')}`;

  const q = query(
    collection(db, COLLECTION),
    where('date', '>=', cutoffKey),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        });
      onUpdate(data);
    },
    (error) => {
      console.error('[Firestore] Error en listener de admin:', error);
      onError?.(error);
    },
  );
}

// ─── Admin: eliminar turno ────────────────────────────────────────────────────

/**
 * Elimina un turno de Firestore por su ID de documento.
 *
 * @param {string} docId  - ID del documento a eliminar
 */
export async function deleteAppointment(docId) {
  await deleteDoc(doc(db, COLLECTION, docId));
}

// ─── Cliente: buscar turnos por teléfono ──────────────────────────────────────

/**
 * Suscripción en tiempo real a los turnos de un cliente por su número de teléfono.
 * Permite al cliente ver y cancelar sus propias reservas sin necesidad de cuenta.
 *
 * @param {string}   phone     - Número de teléfono exacto tal como fue ingresado
 * @param {Function} onUpdate  - Callback con array de turnos del cliente
 * @param {Function} onError   - Callback de error
 * @returns {Function}         - Función de cleanup para useEffect
 */
export function searchAppointmentsByPhone(phone, onUpdate, onError) {
  const q = query(
    collection(db, COLLECTION),
    where('clientPhone', '==', phone),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.time.localeCompare(b.time);
        });
      onUpdate(data);
    },
    (error) => {
      console.error('[Firestore] Error buscando turnos por teléfono:', error);
      onError?.(error);
    },
  );
}
