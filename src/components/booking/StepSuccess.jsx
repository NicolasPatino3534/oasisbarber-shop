import { MONTH_LABELS, DAY_LABELS } from '../../data/businessData.js';

/**
 * Formatea 'YYYY-MM-DD' → "Martes, 10 de Marzo de 2025"
 */
function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]}, ${d} de ${MONTH_LABELS[m - 1]} de ${y}`;
}

/**
 * Pantalla de éxito que se muestra luego de confirmar el turno.
 * Muestra los datos completos de la reserva guardada en localStorage
 * y permite hacer una nueva reserva.
 */
export default function StepSuccess({ appointment, onNewBooking }) {
  if (!appointment) return null;

  const [h] = appointment.time.split(':').map(Number);
  const endTime = `${String(h + 1).padStart(2, '0')}:00`;

  return (
    <div className="step-enter flex flex-col items-center text-center py-4">
      {/* Icono de éxito */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-4xl">
          ✓
        </div>
        {/* Pulso animado */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
      </div>

      <h3 className="text-2xl font-black text-white mb-2">¡Turno Confirmado!</h3>
      <p className="text-zinc-400 text-sm mb-8 max-w-xs">
        Hola <span className="text-white font-semibold">{appointment.clientName}</span>, tu reserva
        ha sido registrada exitosamente. ¡Te esperamos!
      </p>

      {/* Detalle de la reserva */}
      <div className="w-full bg-zinc-900 border border-zinc-700/60 rounded-2xl overflow-hidden mb-8">
        {/* Header tarjeta */}
        <div className="bg-amber-500/10 border-b border-zinc-700/60 px-5 py-3 flex items-center gap-2">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">
            Detalle de tu turno
          </span>
        </div>

        {/* Items */}
        <div className="px-5 py-4 space-y-3">
          {[
            { icon: '👤', label: 'Profesional', value: appointment.professionalName },
            { icon: appointment.serviceIcon || '✂️', label: 'Servicio', value: appointment.serviceName },
            { icon: '📅', label: 'Fecha', value: formatDate(appointment.date) },
            { icon: '🕐', label: 'Horario', value: `${appointment.time} – ${endTime} hs` },
            { icon: '💵', label: 'Total', value: `$${appointment.servicePrice}` },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-left">
              <span className="inline-flex items-center justify-center w-6 text-base flex-shrink-0">{item.icon}</span>
              <span className="text-xs text-zinc-500 uppercase tracking-wider w-20 flex-shrink-0">
                {item.label}
              </span>
              <span className="text-white font-semibold text-sm">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nota de pago */}
      <p className="text-zinc-500 text-xs mb-6">
        El pago se realiza en el local. Por favor llegá 5 minutos antes.
      </p>

      {/* Botón nueva reserva */}
      <button
        onClick={onNewBooking}
        className="w-full py-3 rounded-xl border border-zinc-700 hover:border-amber-500/50 text-zinc-300 hover:text-amber-400 font-semibold text-sm transition-all"
      >
        + Hacer otra reserva
      </button>
    </div>
  );
}
