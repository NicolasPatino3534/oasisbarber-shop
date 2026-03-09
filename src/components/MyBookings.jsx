import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ClipboardList, Search, User, Clock, Calendar, X, Scissors } from 'lucide-react';
import { searchAppointmentsByPhone } from '../services/appointmentsService.js';
import { MONTH_LABELS, DAY_LABELS, BUSINESS_INFO } from '../data/businessData.js';

function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]}, ${d} de ${MONTH_LABELS[m - 1]} de ${y}`;
}

function buildCancelWhatsAppUrl(apt) {
  const msg = `Hola, necesito cancelar mi turno de ${apt.serviceName} con ${apt.professionalName} para el ${formatDate(apt.date)} a las ${apt.time} hs.`;
  return `https://wa.me/${BUSINESS_INFO.whatsappPhone}?text=${encodeURIComponent(msg)}`;
}

export default function MyBookings({ onClose }) {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const unsubRef = useRef(null);

  // Limpieza del listener al desmontar el modal
  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = phone.trim();
    if (!trimmed) return;

    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    setSearching(true);
    setSearched(false);
    setError(null);
    setAppointments([]);

    unsubRef.current = searchAppointmentsByPhone(
      trimmed,
      (data) => {
        setAppointments(data);
        setSearching(false);
        setSearched(true);
      },
      () => {
        setError('No se pudo realizar la búsqueda. Intentá de nuevo.');
        setSearching(false);
        setSearched(true);
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white">Mis Turnos</h2>
            <p className="text-zinc-500 text-sm mt-0.5">Buscá y gestioná tus reservas</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Formulario de búsqueda */}
        <form onSubmit={handleSearch} className="px-6 py-5 border-b border-zinc-800">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Número de teléfono con el que reservaste
          </label>
          <div className="flex gap-3">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ej: +54 11 2345-6789"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all"
            />
            <button
              type="submit"
              disabled={searching || !phone.trim()}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {searching ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : 'Buscar'}
            </button>
          </div>
          <p className="text-zinc-600 text-xs mt-2">
            Ingresá el número exactamente como lo escribiste al reservar.
          </p>
        </form>

        {/* Resultados */}
        <div className="px-6 py-5 max-h-[28rem] overflow-y-auto">

          {/* Error de Firestore */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Spinner de búsqueda */}
          {searching && (
            <div className="flex items-center justify-center py-10 gap-3 text-zinc-400">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm">Buscando turnos...</span>
            </div>
          )}

          {/* Sin resultados */}
          {!searching && searched && appointments.length === 0 && !error && (
            <div className="text-center py-10">
              <ClipboardList className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-300 font-semibold">No encontramos turnos</p>
              <p className="text-zinc-500 text-sm mt-1">
                Verificá que el número sea el mismo que usaste al reservar.
              </p>
            </div>
          )}

          {/* Lista de turnos */}
          {!searching && appointments.length > 0 && (
            <div className="space-y-3">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">
                {appointments.length} turno{appointments.length !== 1 ? 's' : ''} encontrado{appointments.length !== 1 ? 's' : ''}
              </p>

              {appointments.map((apt) => {
                const [h] = apt.time.split(':').map(Number);
                const endTime = `${String(h + 1).padStart(2, '0')}:00`;
                return (
                  <div
                    key={apt.id}
                    className="bg-zinc-900 border border-zinc-700/60 rounded-2xl p-4 flex flex-col gap-3"
                  >
                    {/* Encabezado de la tarjeta */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Scissors className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <span className="text-white font-bold">{apt.serviceName}</span>
                      </div>
                      <span className="text-amber-400 font-black text-lg">${apt.servicePrice}</span>
                    </div>

                    {/* Detalles del turno */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                      <div>
                        <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-0.5">Profesional</span>
                        <span className="text-zinc-200 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 flex-shrink-0" /> {apt.professionalName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-0.5">Horario</span>
                        <span className="text-zinc-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 flex-shrink-0" /> {apt.time} – {endTime} hs
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-zinc-500 text-xs uppercase tracking-wider block mb-0.5">Fecha</span>
                        <span className="text-zinc-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" /> {formatDate(apt.date)}
                        </span>
                      </div>
                    </div>

                    {/* Boton cancelar via WhatsApp */}
                    <a
                      href={buildCancelWhatsAppUrl(apt)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-600/30 hover:border-emerald-600/50 text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 flex-shrink-0">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.52 5.847L.057 23.571a.75.75 0 00.908.94l5.944-1.559A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.98 0-3.831-.538-5.417-1.476l-.388-.232-4.02 1.054 1.022-3.93-.253-.403A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                      Solicitar cancelación por WhatsApp
                    </a>
                  </div>
                );
              })}
            </div>
          )}

          {/* Estado inicial (sin búsqueda aún) */}
          {!searched && !searching && (
            <div className="text-center py-10">
              <Search className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-500 text-sm">
                Ingresá tu teléfono para ver tus turnos activos.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
