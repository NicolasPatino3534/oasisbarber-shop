/**
 * useAppointments.js
 *
 * Dos hooks que conectan la UI con el servicio de Firestore.
 * Los componentes solo importan estos hooks — nunca tocan Firestore directamente.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToBookedSlots,
  createAppointment,
} from '../services/appointmentsService.js';

// ─────────────────────────────────────────────────────────────────────────────
// Hook 1: Suscripción en tiempo real a los slots ocupados
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retorna el Set de horarios ocupados para un profesional en una fecha,
 * manteniéndose actualizado en tiempo real via Firestore onSnapshot.
 *
 * Cuando professionalId o date cambian, cancela la suscripción anterior
 * y abre una nueva (limpieza automática en el return del useEffect).
 *
 * @param {string|null} professionalId
 * @param {string|null} date - Formato 'YYYY-MM-DD'
 * @returns {{ bookedSlots: Set<string>, loading: boolean, error: string|null }}
 */
export function useBookedSlots(professionalId, date) {
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay profesional o fecha todavía, no hacemos nada
    if (!professionalId || !date) {
      setBookedSlots(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Abre el listener en tiempo real; retorna la función de unsubscribe
    const unsubscribe = subscribeToBookedSlots(
      professionalId,
      date,
      (slots) => {
        setBookedSlots(slots);
        setLoading(false);
      },
      () => {
        setError('No se pudieron cargar los horarios. Verificá tu conexión.');
        setLoading(false);
      },
    );

    // React llama a este return cuando el componente se desmonta
    // o cuando professionalId/date cambian → cancela el listener anterior
    return () => unsubscribe();
  }, [professionalId, date]);

  return { bookedSlots, loading, error };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook 2: Crear un turno con manejo de loading y error
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Provee una función `create` para guardar un turno en Firestore.
 * Maneja los estados de carga y error para que la UI los muestre.
 *
 * @returns {{ create: Function, saving: boolean, saveError: string|null }}
 */
export function useCreateAppointment() {
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const create = useCallback(async (appointmentData) => {
    setSaving(true);
    setSaveError(null);

    try {
      const result = await createAppointment(appointmentData);
      return { success: true, appointment: result };
    } catch (err) {
      const message =
        err.message || 'Error al guardar el turno. Intentá nuevamente.';
      setSaveError(message);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, []);

  return { create, saving, saveError };
}
