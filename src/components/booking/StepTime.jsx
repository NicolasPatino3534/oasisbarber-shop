import { useEffect, useState } from 'react';
import { TIME_SLOTS } from '../../data/businessData.js';
import { useAppointments } from '../../hooks/useAppointments.js';
import { MONTH_LABELS, DAY_LABELS } from '../../data/businessData.js';

/**
 * Formatea una fecha 'YYYY-MM-DD' a texto legible, ej: "Martes 10 de Marzo"
 */
function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  // Construimos con UTC para evitar desfases de zona horaria
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]} ${d} de ${MONTH_LABELS[m - 1]}`;
}

/**
 * Paso 4: El cliente elige el horario.
 * Los slots ocupados para el profesional + fecha seleccionados
 * se leen desde localStorage y se muestran como "Ocupado".
 *
 * REGLA CRÍTICA: getBookedSlots(professionalId, date) retorna un Set
 * con los horarios ya reservados; si el horario está en ese Set,
 * se deshabilita el botón y se muestra "Ocupado".
 */
export default function StepTime({ selected, professional, service, date, onSelect }) {
  const { getBookedSlots } = useAppointments();

  // Estado local que almacena los horarios ocupados para este [profesional + fecha]
  const [bookedSlots, setBookedSlots] = useState(new Set());

  // Cada vez que cambie el profesional o la fecha, recargamos los slots ocupados
  useEffect(() => {
    if (professional?.id && date) {
      setBookedSlots(getBookedSlots(professional.id, date));
    }
  }, [professional, date, getBookedSlots]);

  const formattedDate = formatDate(date);

  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Elegí el horario</h3>
      <p className="text-zinc-400 text-sm mb-1">
        Con{' '}
        <span className="text-amber-400 font-semibold">{professional?.name}</span>
        {' · '}
        <span className="text-amber-400 font-semibold">{service?.name}</span>
      </p>
      <p className="text-zinc-500 text-sm mb-6">
        📅 <span className="text-zinc-300">{formattedDate}</span>
      </p>

      {/* Grid de slots horarios */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {TIME_SLOTS.map((slot) => {
          const isTaken = bookedSlots.has(slot);
          const isSelected = selected === slot;

          // Calculamos la hora de fin del turno (duration es siempre 60 min)
          const [h] = slot.split(':').map(Number);
          const endTime = `${String(h + 1).padStart(2, '0')}:00`;

          return (
            <button
              key={slot}
              disabled={isTaken}
              onClick={() => !isTaken && onSelect(slot)}
              className={`relative flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                isTaken
                  ? // Slot OCUPADO: gris, cursor no permitido
                    'border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  : isSelected
                  ? // Slot SELECCIONADO: resaltado en amber
                    'border-amber-500 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10'
                  : // Slot DISPONIBLE: estilo normal con hover
                    'border-zinc-700 bg-zinc-800/70 text-zinc-200 hover:border-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {/* Horario */}
              <span className="text-base font-bold">{slot}</span>
              <span className="text-xs opacity-60 font-normal">{endTime}</span>

              {/* Badge de estado */}
              {isTaken && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-zinc-800 border border-zinc-700 text-zinc-500 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                  Ocupado
                </span>
              )}
              {isSelected && !isTaken && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-950 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                  Seleccionado
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center gap-6 mt-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-amber-500 bg-amber-500/20" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-zinc-800 bg-zinc-900" />
          <span>Ocupado</span>
        </div>
      </div>
    </div>
  );
}
