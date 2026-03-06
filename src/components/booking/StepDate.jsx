import { useMemo } from 'react';
import { WORKING_DAY_NUMBERS, DAY_LABELS, MONTH_LABELS } from '../../data/businessData.js';

/**
 * Genera los próximos N días hábiles a partir de mañana,
 * excluyendo domingos (getDayOfWeek() === 0).
 * @param {number} count - Cantidad de días a mostrar
 * @returns {Date[]}
 */
function getAvailableDates(count = 30) {
  const dates = [];
  // Empezamos desde mañana (no se puede reservar para hoy)
  const cursor = new Date();
  cursor.setDate(cursor.getDate() + 1);
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    if (WORKING_DAY_NUMBERS.includes(cursor.getDay())) {
      dates.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

/**
 * Convierte una fecha a string formato 'YYYY-MM-DD' (clave usada en localStorage).
 */
export function dateToKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Paso 3: El cliente elige la fecha de su turno.
 * Solo se muestran los próximos 30 días hábiles (Lun–Sáb).
 */
export default function StepDate({ selected, professional, service, onSelect }) {
  // Calcula la lista de fechas disponibles (memozada para no recalcular en cada render)
  const availableDates = useMemo(() => getAvailableDates(30), []);

  // Agrupamos por mes para mostrar separadores de mes en la UI
  const grouped = useMemo(() => {
    const map = new Map();
    for (const date of availableDates) {
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(monthKey)) map.set(monthKey, []);
      map.get(monthKey).push(date);
    }
    return map;
  }, [availableDates]);

  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Elegí la fecha</h3>
      <p className="text-zinc-400 text-sm mb-6">
        Turno con{' '}
        <span className="text-amber-400 font-semibold">{professional?.name}</span>
        {' · '}
        <span className="text-amber-400 font-semibold">{service?.name}</span>
      </p>

      {/* Listado agrupado por mes */}
      <div className="space-y-6 max-h-80 overflow-y-auto pr-1 custom-scroll">
        {[...grouped.entries()].map(([monthKey, dates]) => {
          const firstDate = dates[0];
          return (
            <div key={monthKey}>
              {/* Cabecera de mes */}
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
                {MONTH_LABELS[firstDate.getMonth()]} {firstDate.getFullYear()}
              </p>

              {/* Grid de días */}
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                {dates.map((date) => {
                  const key = dateToKey(date);
                  const isSelected = selected === key;
                  return (
                    <button
                      key={key}
                      onClick={() => onSelect(key)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 aspect-square ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/15 text-amber-400 shadow-lg shadow-amber-500/10'
                          : 'border-zinc-700 bg-zinc-800/60 text-zinc-300 hover:border-zinc-500 hover:text-white'
                      }`}
                    >
                      <span className="text-xs text-zinc-500 font-medium">
                        {DAY_LABELS[date.getDay()]}
                      </span>
                      <span className="text-base font-bold leading-none mt-0.5">
                        {date.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
