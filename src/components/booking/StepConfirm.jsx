import { useState } from 'react';
import { MONTH_LABELS, DAY_LABELS } from '../../data/businessData.js';

/**
 * Formatea 'YYYY-MM-DD' → "Lun, 10 de Marzo de 2025"
 */
function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]}, ${d} de ${MONTH_LABELS[m - 1]} de ${y}`;
}

/**
 * Paso 5: Resumen del turno + formulario para ingresar el nombre del cliente.
 * Al confirmar, se llama a onConfirm(clientName).
 */
export default function StepConfirm({ professional, service, date, time, onConfirm, onBack }) {
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Hora de fin del turno
  const [h] = time ? time.split(':').map(Number) : [0];
  const endTime = `${String(h + 1).padStart(2, '0')}:00`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = clientName.trim();
    if (!trimmed) {
      setError('Por favor, ingresá tu nombre para continuar.');
      return;
    }
    if (trimmed.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    // Pequeña pausa para UX (simula latencia de red)
    await new Promise((r) => setTimeout(r, 500));
    onConfirm(trimmed);
    setLoading(false);
  };

  const summaryItems = [
    { label: 'Profesional', value: professional?.name, icon: '👤' },
    { label: 'Servicio', value: `${service?.name}  ($${service?.price})`, icon: service?.icon },
    { label: 'Fecha', value: formatDate(date), icon: '📅' },
    { label: 'Horario', value: time ? `${time} – ${endTime} hs` : '', icon: '🕐' },
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
            {/* inline-flex necesario: text-center no opera sobre span con width fijo */}
            <span className="inline-flex items-center justify-center w-7 text-lg flex-shrink-0">{item.icon}</span>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xs text-zinc-500 uppercase tracking-wider w-20 flex-shrink-0">
                {item.label}
              </span>
              <span className="text-white font-semibold text-sm">{item.value}</span>
            </div>
          </div>
        ))}

        {/* Línea total */}
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
            if (error) setError('');
          }}
          placeholder="Ej: Juan Pérez"
          maxLength={60}
          className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 transition-all ${
            error
              ? 'border-red-500/60 focus:ring-red-500/30'
              : 'border-zinc-700 focus:ring-amber-500/40 focus:border-amber-500/60'
          }`}
        />
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm font-semibold transition-all disabled:opacity-50"
          >
            ← Volver
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Confirmando…
              </>
            ) : (
              '✓ Confirmar Turno'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
