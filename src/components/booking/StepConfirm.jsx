import { useState } from 'react';
import { User, Scissors, Calendar, Clock, AlertTriangle, Check } from 'lucide-react';
import { MONTH_LABELS, DAY_LABELS } from '../../data/businessData.js';

function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]}, ${d} de ${MONTH_LABELS[m - 1]} de ${y}`;
}

/**
 * Paso 5: Resumen del turno + formulario nombre del cliente.
 *
 * saving y saveError vienen de Booking.jsx (hook useCreateAppointment).
 * Este componente no maneja la lógica async — solo llama onConfirm(nombre)
 * y deja que el padre maneje el estado de la operación Firebase.
 */
export default function StepConfirm({ professional, service, date, time, onConfirm, onBack, saving, saveError }) {
  const [clientName, setClientName] = useState('');
  const [validationError, setValidationError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneConfirm, setPhoneConfirm] = useState('');
  const [phoneConfirmError, setPhoneConfirmError] = useState('');

  const [h, startM] = time ? time.split(':').map(Number) : [0, 0];
  const durationMins = service?.duration || 60;
  const endMins = h * 60 + (startM || 0) + durationMins;
  const endTime = `${String(Math.floor(endMins / 60)).padStart(2, '0')}:${String(endMins % 60).padStart(2, '0')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = clientName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmed) {
      setValidationError('Por favor, ingresá tu nombre para continuar.');
      return;
    }
    if (trimmed.length < 2) {
      setValidationError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    if (!trimmedPhone) {
      setPhoneError('Por favor, ingresá tu número de teléfono.');
      return;
    }
    if (!/^[\d\s\+\-\(\)]{7,20}$/.test(trimmedPhone)) {
      setPhoneError('Ingresá un número de teléfono válido.');
      return;
    }
    if (phoneConfirm.trim() !== trimmedPhone) {
      setPhoneConfirmError('Los números de teléfono no coinciden.');
      return;
    }
    setValidationError('');
    setPhoneError('');
    setPhoneConfirmError('');
    onConfirm(trimmed, trimmedPhone);
  };

  const summaryItems = [
    { label: 'Profesional', value: professional?.name,                          icon: <User      className="w-4 h-4" /> },
    { label: 'Servicio',    value: `${service?.name}  ($${service?.price})`,    icon: <Scissors  className="w-4 h-4" /> },
    { label: 'Fecha',       value: formatDate(date),                             icon: <Calendar  className="w-4 h-4" /> },
    { label: 'Horario',     value: time ? `${time} – ${endTime} hs` : '',       icon: <Clock     className="w-4 h-4" /> },
  ];

  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Confirmá tu turno</h3>
      <p className="text-zinc-400 text-sm mb-6">
        Revisá los detalles y completá tu nombre para finalizar la reserva.
      </p>

      {/* Resumen */}
      <div className="bg-zinc-900 border border-zinc-700/60 rounded-2xl p-5 mb-6 space-y-3">
        {summaryItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-7 text-zinc-400 flex-shrink-0">
              {item.icon}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs text-zinc-500 uppercase tracking-wider w-24 flex-shrink-0">
                {item.label}
              </span>
              <span className="text-white font-semibold text-sm">{item.value}</span>
            </div>
          </div>
        ))}

        <div className="border-t border-zinc-700/50 pt-3 flex items-center justify-between">
          <span className="text-zinc-400 text-sm">Total a abonar en el local</span>
          <span className="text-amber-400 text-2xl font-black">${service?.price}</span>
        </div>
      </div>

      {/* Formulario de nombre */}
      <form onSubmit={handleSubmit} noValidate>
        <label className="block mb-1.5">
          <span className="text-sm font-medium text-zinc-300">Tu nombre completo</span>
        </label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => {
            setClientName(e.target.value);
            if (validationError) setValidationError('');
          }}
          placeholder="Ej: Juan Pérez"
          maxLength={60}
          disabled={saving}
          className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
            validationError
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-zinc-700 focus:ring-amber-500/40 focus:border-amber-500/60'
          }`}
        />
        {validationError && <p className="text-red-400 text-xs mt-2">{validationError}</p>}

        {/* Campo teléfono */}
        <label className="block mt-4 mb-1.5">
          <span className="text-sm font-medium text-zinc-300">Teléfono de contacto</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (phoneError) setPhoneError('');
          }}
          placeholder="Ej: +54 11 2345-6789"
          maxLength={25}
          disabled={saving}
          className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
            phoneError
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-zinc-700 focus:ring-amber-500/40 focus:border-amber-500/60'
          }`}
        />
        {phoneError && <p className="text-red-400 text-xs mt-2">{phoneError}</p>}

        {/* Confirmación de teléfono */}
        <label className="block mt-4 mb-1.5">
          <span className="text-sm font-medium text-zinc-300">Confirmá tu teléfono</span>
        </label>
        <input
          type="tel"
          value={phoneConfirm}
          onChange={(e) => {
            setPhoneConfirm(e.target.value);
            if (phoneConfirmError) setPhoneConfirmError('');
          }}
          placeholder="Repetí el número para confirmar"
          maxLength={25}
          disabled={saving}
          className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
            phoneConfirmError
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-zinc-700 focus:ring-amber-500/40 focus:border-amber-500/60'
          }`}
        />
        {phoneConfirmError && <p className="text-red-400 text-xs mt-2">{phoneConfirmError}</p>}

        {/* Error de Firestore */}
        {saveError && (
          <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-xs leading-relaxed">{saveError}</p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={saving}
            className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm font-semibold transition-all disabled:opacity-50"
          >
            ← Volver
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-[2] py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Guardando en Firestore…
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirmar Turno
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
