import { useCallback } from 'react';

// Clave usada en localStorage para persistir todos los turnos
const STORAGE_KEY = 'oasis_appointments';

/**
 * Hook personalizado que encapsula toda la lógica de persistencia de turnos.
 * Los datos se guardan en localStorage como un array JSON de objetos:
 * {
 *   id: string,           // ID único (timestamp)
 *   professionalId: string,
 *   professionalName: string,
 *   serviceId: string,
 *   serviceName: string,
 *   servicePrice: number,
 *   date: string,          // Formato 'YYYY-MM-DD'
 *   time: string,          // Formato 'HH:00'
 *   clientName: string,
 *   createdAt: string,     // ISO timestamp
 * }
 */
export function useAppointments() {
  /**
   * Lee y retorna todos los turnos almacenados en localStorage.
   * Retorna un array vacío si no hay datos o si hay un error de parseo.
   */
  const getAppointments = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      // Si el JSON está corrupto, devolvemos array vacío para no bloquear la app
      return [];
    }
  }, []);

  /**
   * Devuelve true si el slot [professionalId + date + time] ya está reservado.
   * Esta es la función clave para evitar la superposición de turnos.
   */
  const isSlotTaken = useCallback(
    (professionalId, date, time) => {
      const appointments = getAppointments();
      return appointments.some(
        (apt) =>
          apt.professionalId === professionalId &&
          apt.date === date &&
          apt.time === time,
      );
    },
    [getAppointments],
  );

  /**
   * Retorna un Set con todos los horarios ya reservados para
   * un profesional en una fecha determinada. Usado por StepTime.jsx
   * para marcar slots como "Ocupados" en la UI.
   */
  const getBookedSlots = useCallback(
    (professionalId, date) => {
      const appointments = getAppointments();
      const times = appointments
        .filter((apt) => apt.professionalId === professionalId && apt.date === date)
        .map((apt) => apt.time);
      return new Set(times);
    },
    [getAppointments],
  );

  /**
   * Persiste un nuevo turno en localStorage.
   * Antes de guardar, realiza una comprobación final de conflictos
   * (doble seguridad: la UI ya los evita, pero acá lo reforzamos).
   *
   * @param {object} appointment - Datos del turno a guardar
   * @returns {{ success: boolean, appointment?: object, error?: string }}
   */
  const addAppointment = useCallback(
    (appointment) => {
      const appointments = getAppointments();

      // Verificación final de conflicto antes de persistir
      const conflict = isSlotTaken(
        appointment.professionalId,
        appointment.date,
        appointment.time,
      );

      if (conflict) {
        return {
          success: false,
          error: 'Este turno acaba de ser reservado por otra persona. Por favor, elegí otro horario.',
        };
      }

      const newAppointment = {
        ...appointment,
        id: Date.now().toString(),    // ID único basado en timestamp
        createdAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify([...appointments, newAppointment]),
        );
        return { success: true, appointment: newAppointment };
      } catch {
        return { success: false, error: 'Error al guardar el turno. Intentá nuevamente.' };
      }
    },
    [getAppointments, isSlotTaken],
  );

  return { getAppointments, isSlotTaken, getBookedSlots, addAppointment };
}
