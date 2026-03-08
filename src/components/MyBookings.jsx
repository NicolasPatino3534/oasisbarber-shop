import { useState, useEffect, useRef } from 'react';
import { AlertTriangle, ClipboardList, Search, User, Clock, Calendar, X, Scissors } from 'lucide-react';
import { searchAppointmentsByPhone, deleteAppointment } from '../services/appointmentsService.js';
import { MONTH_LABELS, DAY_LABELS } from '../data/businessData.js';

function formatDate(dateKey) {
  if (!dateKey) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]}, ${d} de ${MONTH_LABELS[m - 1]} de ${y}`;
}

export default function MyBookings({ onClose }) {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
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

  const handleCancel = async (apt) => {
    const ok = window.confirm(
      `¿Cancelar el turno del ${formatDate(apt.date)} a las ${apt.time} hs con ${apt.professionalName}?\n\nEsta acción no se puede deshacer.`,
    );
    if (!ok) return;

    setCancellingId(apt.id);
    try {
      await deleteAppointment(apt.id);
    } catch {
      alert('No se pudo cancelar el turno. Intentá de nuevo.');
    } finally {
      setCancellingId(null);
    }
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
                const isCancelling = cancellingId === apt.id;

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

                    {/* Botón cancelar */}
                    <button
                      onClick={() => handleCancel(apt)}
                      disabled={isCancelling}
                      className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isCancelling ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Cancelando...
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          Cancelar turno
                        </>
                      )}
                    </button>
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
