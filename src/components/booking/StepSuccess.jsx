import { User, Scissors, Calendar, Clock, Banknote, Check } from 'lucide-react';
import { MONTH_LABELS, DAY_LABELS, BUSINESS_INFO } from '../../data/businessData.js';

function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]}, ${d} de ${MONTH_LABELS[m - 1]} de ${y}`;
}

function buildWhatsAppUrl(appointment) {
  const { clientName, professionalName, serviceName, date, time } = appointment;
  const msg =
    `¡Hola! Soy ${clientName} y acabo de reservar un turno en Oasis Hair & Beard 💈\n\n` +
    `👤 Profesional: ${professionalName}\n` +
    `✂️ Servicio: ${serviceName}\n` +
    `📅 Fecha: ${formatDate(date)}\n` +
    `🕐 Horario: ${time} hs\n\n` +
    `¡Hasta pronto!`;
  return `https://wa.me/${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(msg)}`;
}

/**
 * Pantalla de éxito que se muestra luego de confirmar el turno.
 * Muestra los datos completos de la reserva y un acceso directo a WhatsApp.
 */
export default function StepSuccess({ appointment, onNewBooking }) {
  if (!appointment) return null;

  const [h] = appointment.time.split(':').map(Number);
  const endTime = `${String(h + 1).padStart(2, '0')}:00`;
  const whatsappUrl = buildWhatsAppUrl(appointment);

  const items = [
    { icon: <User     className="w-4 h-4" />, label: 'Profesional', value: appointment.professionalName },
    { icon: <Scissors className="w-4 h-4" />, label: 'Servicio',    value: appointment.serviceName },
    { icon: <Calendar className="w-4 h-4" />, label: 'Fecha',       value: formatDate(appointment.date) },
    { icon: <Clock    className="w-4 h-4" />, label: 'Horario',     value: `${appointment.time} – ${endTime} hs` },
    { icon: <Banknote className="w-4 h-4" />, label: 'Total',       value: `$${appointment.servicePrice}` },
  ];

  return (
    <div className="step-enter flex flex-col items-center text-center py-4">
      {/* Icono de éxito */}
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
          <Check className="w-9 h-9 text-emerald-400" />
        </div>
        {/* Pulso animado */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
      </div>

      <h3 className="text-2xl font-black text-white mb-2">Turno Confirmado</h3>
      <p className="text-zinc-400 text-sm mb-8 max-w-xs">
        Hola <span className="text-white font-semibold">{appointment.clientName}</span>, tu reserva
        ha sido registrada exitosamente. ¡Te esperamos!
      </p>

      {/* Detalle de la reserva */}
      <div className="w-full bg-zinc-900 border border-zinc-700/60 rounded-2xl overflow-hidden mb-8">
        {/* Header tarjeta */}
        <div className="bg-amber-500/10 border-b border-zinc-700/60 px-5 py-3">
          <span className="text-amber-400 font-bold text-sm uppercase tracking-wider">
            Detalle de tu turno
          </span>
        </div>

        {/* Items */}
        <div className="px-5 py-4 space-y-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-left">
              <span className="inline-flex items-center justify-center w-6 text-zinc-400 flex-shrink-0">
                {item.icon}
              </span>
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

      {/* Botón WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 mb-3 shadow-lg shadow-emerald-900/40"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.52 5.847L.057 23.571a.75.75 0 00.908.94l5.944-1.559A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.98 0-3.831-.538-5.417-1.476l-.388-.232-4.02 1.054 1.022-3.93-.253-.403A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
        Enviar confirmación por WhatsApp
      </a>

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
