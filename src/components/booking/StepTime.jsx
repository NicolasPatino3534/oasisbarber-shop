import { Calendar, AlertTriangle } from 'lucide-react';
import { TIME_SLOTS } from '../../data/businessData.js';
import { useBookedSlots } from '../../hooks/useAppointments.js';
import { MONTH_LABELS, DAY_LABELS } from '../../data/businessData.js';

function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]} ${d} de ${MONTH_LABELS[m - 1]}`;
}

/**
 * Paso 4: El cliente elige el horario.
 *
 * Usa useBookedSlots() que abre un listener en tiempo real contra Firestore.
 * Cada vez que otro cliente confirma un turno para el mismo [profesional + fecha],
 * el slot se bloquea en la UI automáticamente sin recargar la página.
 */
export default function StepTime({ selected, professional, service, date, onSelect }) {
  const { bookedSlots, loading, error } = useBookedSlots(professional?.id, date);

  const formattedDate = formatDate(date);

  if (loading) {
    return (
      <div className="step-enter">
        <h3 className="text-xl font-bold text-white mb-2">Elegí el horario</h3>
        <p className="text-zinc-500 text-sm mb-6 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span className="text-zinc-300">{formattedDate}</span>
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-800/60 border border-zinc-700/40 animate-pulse" />
          ))}
        </div>
        <p className="text-zinc-600 text-xs mt-4 text-center">Consultando disponibilidad…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="step-enter text-center py-6">
        <AlertTriangle className="w-10 h-10 text-red-400 mb-3 mx-auto" />
        <p className="text-red-400 font-semibold mb-1">Error al cargar los horarios</p>
        <p className="text-zinc-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Elegí el horario</h3>
      <p className="text-zinc-400 text-sm mb-1">
        Con{' '}
        <span className="text-amber-400 font-semibold">{professional?.name}</span>
        {' · '}
        <span className="text-amber-400 font-semibold">{service?.name}</span>
      </p>
      <p className="text-zinc-500 text-sm mb-6 flex items-center gap-1.5">
        <Calendar className="w-4 h-4 flex-shrink-0" />
        <span className="text-zinc-300">{formattedDate}</span>
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {TIME_SLOTS.map((slot) => {
          const isTaken = bookedSlots.has(slot);
          const isSelected = selected === slot;
          const [h] = slot.split(':').map(Number);
          const endTime = `${String(h + 1).padStart(2, '0')}:00`;

          return (
            <button
              key={slot}
              disabled={isTaken}
              onClick={() => !isTaken && onSelect(slot)}
              className={`relative flex flex-col items-center justify-center py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                isTaken
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-600 cursor-not-allowed'
                  : isSelected
                  ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-lg shadow-amber-500/10'
                  : 'border-zinc-700 bg-zinc-800/70 text-zinc-200 hover:border-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span className="text-base font-bold">{slot}</span>
              <span className="text-xs opacity-60 font-normal">{endTime}</span>

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

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-amber-500 bg-amber-500/20" />
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-zinc-800 bg-zinc-900" />
            <span>Ocupado</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En tiempo real
        </div>
      </div>
    </div>
  );
}
