import { useState, useEffect } from 'react';
import { subscribeToAllAppointments, deleteAppointment } from '../services/appointmentsService.js';
import { MONTH_LABELS, DAY_LABELS } from '../data/businessData.js';

// ─── Contraseña ───────────────────────────────────────────────────────────────
// Definí VITE_ADMIN_PASSWORD en tu .env (y en Vercel → Environment Variables)
// para sobreescribir la contraseña por defecto.
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'oasis2024';

function formatDate(dateKey) {
  if (!dateKey) return '-';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]} ${d}/${m}/${y}`;
}

// ─── Formulario de acceso ─────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Contraseña incorrecta.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-4xl">💈</span>
          <h1 className="font-display text-2xl font-black text-white mt-3">Panel de Administración</h1>
          <p className="text-zinc-500 text-sm mt-1">Oasis Hair &amp; Beard</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/60">
          <label className="block mb-1.5">
            <span className="text-sm font-medium text-zinc-300">Contraseña</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            placeholder="••••••••"
            autoFocus
            className={`w-full bg-zinc-800 border rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 transition-all ${
              error
                ? 'border-red-500/60 focus:ring-red-500/30'
                : 'border-zinc-700 focus:ring-amber-500/40 focus:border-amber-500/60'
            }`}
          />
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            Ingresar
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-4">
          <a href="/" className="hover:text-zinc-400 transition-colors">← Volver al sitio</a>
        </p>
      </div>
    </div>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────

function AdminTable({ appointments, onDelete }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-zinc-400 font-semibold">No hay turnos registrados.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-900 border-b border-zinc-800 text-left">
            {['Fecha', 'Horario', 'Cliente', 'Teléfono', 'Profesional', 'Servicio', 'Precio', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-amber-400 first:pl-5 last:pr-5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((apt, idx) => (
            <tr
              key={apt.id}
              className={`border-b border-zinc-800/60 transition-colors hover:bg-zinc-800/30 ${
                idx % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
              }`}
            >
              <td className="px-4 py-3 pl-5 text-zinc-300 whitespace-nowrap">{formatDate(apt.date)}</td>
              <td className="px-4 py-3 text-zinc-300 whitespace-nowrap font-mono">{apt.time}</td>
              <td className="px-4 py-3 text-white font-semibold whitespace-nowrap">{apt.clientName}</td>
              <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{apt.clientPhone || '-'}</td>
              <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">{apt.professionalName}</td>
              <td className="px-4 py-3 text-zinc-300 whitespace-nowrap">
                <span className="mr-1">{apt.serviceIcon}</span>
                {apt.serviceName}
              </td>
              <td className="px-4 py-3 text-amber-400 font-bold whitespace-nowrap">${apt.servicePrice}</td>
              <td className="px-4 py-3 pr-5">
                <button
                  onClick={() => onDelete(apt)}
                  className="text-xs font-semibold text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 rounded-lg px-2.5 py-1 transition-all"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Componente raíz del panel ────────────────────────────────────────────────

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listenError, setListenError] = useState(null);

  useEffect(() => {
    if (!authenticated) return;

    setLoading(true);
    const unsubscribe = subscribeToAllAppointments(
      (data) => { setAppointments(data); setLoading(false); },
      ()     => { setListenError('No se pudieron cargar los turnos.'); setLoading(false); },
    );

    return () => unsubscribe();
  }, [authenticated]);

  const handleDelete = async (apt) => {
    const ok = window.confirm(
      `¿Eliminar el turno de ${apt.clientName}?\n${formatDate(apt.date)} a las ${apt.time} con ${apt.professionalName}.`,
    );
    if (!ok) return;
    try {
      await deleteAppointment(apt.id);
    } catch {
      alert('Error al eliminar el turno. Intentá de nuevo.');
    }
  };

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💈</span>
          <div>
            <h1 className="font-display font-black text-lg text-white leading-none">Oasis Hair &amp; Beard</h1>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Panel de Administración</p>
          </div>
        </div>
        <a
          href="/"
          className="text-sm text-zinc-400 hover:text-amber-400 font-medium transition-colors border border-zinc-800 hover:border-zinc-700 rounded-lg px-3 py-1.5"
        >
          ← Sitio público
        </a>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Stats rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Total de turnos</p>
            <p className="text-3xl font-black text-white">{appointments.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Recaudación estimada</p>
            <p className="text-3xl font-black text-amber-400">
              ${appointments.reduce((acc, a) => acc + (a.servicePrice || 0), 0)}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <p className="text-sm text-zinc-400">Actualizando en tiempo real</p>
          </div>
        </div>

        {/* Tabla */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Turnos reservados</h2>
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-zinc-800/60 animate-pulse" />
            ))}
          </div>
        )}

        {listenError && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <span className="text-red-400">⚠️</span>
            <p className="text-red-400 text-sm">{listenError}</p>
          </div>
        )}

        {!loading && !listenError && (
          <AdminTable appointments={appointments} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
