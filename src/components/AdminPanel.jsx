import { useState, useEffect } from 'react';
import { Scissors, Inbox, AlertTriangle, Users } from 'lucide-react';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { subscribeToAllAppointments, deleteAppointment } from '../services/appointmentsService.js';
import { MONTH_LABELS, DAY_LABELS } from '../data/businessData.js';

// ─── Contraseña ───────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'oasis2024';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateKey) {
  if (!dateKey) return '-';
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return `${DAY_LABELS[date.getUTCDay()]} ${d}/${m}/${y}`;
}

const INPUT_CLS =
  'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-all';

const GRADIENT_OPTIONS = [
  { label: 'Ámbar',    value: 'from-amber-400 to-amber-600' },
  { label: 'Esmeralda', value: 'from-emerald-400 to-emerald-600' },
  { label: 'Cielo',    value: 'from-sky-400 to-sky-600' },
  { label: 'Violeta',  value: 'from-violet-400 to-violet-600' },
  { label: 'Rosa',     value: 'from-rose-400 to-rose-600' },
  { label: 'Naranja',  value: 'from-orange-400 to-orange-600' },
];

// ─── LoginScreen ──────────────────────────────────────────────────────────────

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
        <div className="text-center mb-8">
          <Scissors className="w-10 h-10 text-amber-400 mx-auto" />
          <h1 className="font-display text-2xl font-black text-white mt-3">Panel de Administración</h1>
          <p className="text-zinc-500 text-sm mt-1">Oasis Hair &amp; Beard</p>
        </div>

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
            className={`${INPUT_CLS} ${error ? 'border-red-500/60 focus:ring-red-500/30' : ''}`}
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

// ─── AdminTable (turnos) ──────────────────────────────────────────────────────

function AdminTable({ appointments, onDelete }) {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-16">
        <Inbox className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
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

// ─── TurnosTab ────────────────────────────────────────────────────────────────

function TurnosTab() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listenError, setListenError] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAllAppointments(
      (data) => { setAppointments(data); setLoading(false); },
      ()     => { setListenError('No se pudieron cargar los turnos.'); setLoading(false); },
    );
    return () => unsub();
  }, []);

  const handleDelete = async (apt) => {
    if (!window.confirm(
      `¿Eliminar el turno de ${apt.clientName}?\n${formatDate(apt.date)} a las ${apt.time} con ${apt.professionalName}.`,
    )) return;
    try { await deleteAppointment(apt.id); }
    catch { alert('Error al eliminar el turno. Intentá de nuevo.'); }
  };

  return (
    <>
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

      <div className="mb-4">
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
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{listenError}</p>
        </div>
      )}

      {!loading && !listenError && (
        <AdminTable appointments={appointments} onDelete={handleDelete} />
      )}
    </>
  );
}

// ─── ServiciosTab ─────────────────────────────────────────────────────────────

const EMPTY_SVC = { nombre: '', precio: '', duracion: '', descripcion: '', popular: false };

function ServiciosTab() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null); // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_SVC);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'servicios'),
      (snap) => { setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => { setEditing(null); setForm(EMPTY_SVC); setFormMode('add'); };
  const openEdit = (svc) => {
    setEditing(svc);
    setForm({
      nombre:      svc.name        || '',
      precio:      String(svc.price    ?? ''),
      duracion:    String(svc.duration ?? ''),
      descripcion: svc.description || '',
      popular:     Boolean(svc.popular),
    });
    setFormMode('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    const payload = {
      name:        form.nombre.trim(),
      price:       Number(form.precio),
      duration:    Number(form.duracion),
      description: form.descripcion.trim(),
      popular:     form.popular,
    };
    try {
      if (formMode === 'add') await addDoc(collection(db, 'servicios'), payload);
      else                    await updateDoc(doc(db, 'servicios', editing.id), payload);
      setFormMode(null);
    } catch { alert('Error al guardar. Intentá de nuevo.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (svc) => {
    if (!window.confirm(`¿Eliminar "${svc.name}"? Esta acción no se puede deshacer.`)) return;
    try { await deleteDoc(doc(db, 'servicios', svc.id)); }
    catch { alert('Error al eliminar. Intentá de nuevo.'); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Servicios</h2>
        {!formMode && (
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all"
          >
            + Agregar servicio
          </button>
        )}
      </div>

      {/* Formulario */}
      {formMode && (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-700/60 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="text-base font-bold text-white">
            {formMode === 'add' ? 'Nuevo servicio' : 'Editar servicio'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nombre *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej: Corte Clásico"
                required
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Precio ($)</label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) => set('precio', e.target.value)}
                placeholder="Ej: 15"
                min="0"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Duración (minutos)</label>
              <input
                type="number"
                value={form.duracion}
                onChange={(e) => set('duracion', e.target.value)}
                placeholder="Ej: 30"
                min="0"
                className={INPUT_CLS}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => set('descripcion', e.target.value)}
              placeholder="Descripción breve del servicio"
              rows={2}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => set('popular', e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-sm text-zinc-300">Marcar como popular</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormMode(null)}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-zinc-800/60 animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-16">
          <Scissors className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No hay servicios registrados. Agregá el primero.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-left">
                {['Servicio', 'Precio', 'Duración', 'Popular', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-amber-400 first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((svc, idx) => (
                <tr
                  key={svc.id}
                  className={`border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
                  }`}
                >
                  <td className="px-4 py-3 pl-5 text-white font-semibold whitespace-nowrap">
                    {svc.name}
                  </td>
                  <td className="px-4 py-3 text-amber-400 font-bold">${svc.price}</td>
                  <td className="px-4 py-3 text-zinc-300">{svc.duration} min</td>
                  <td className="px-4 py-3">
                    {svc.popular
                      ? <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">Sí</span>
                      : <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-4 py-3 pr-5">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(svc)}
                        className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-lg px-2.5 py-1 transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(svc)}
                        className="text-xs font-semibold text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 rounded-lg px-2.5 py-1 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── StaffTab ─────────────────────────────────────────────────────────────────

const EMPTY_MEMBER = {
  nombre: '', rol: '', especialidad: '', bio: '',
  color: 'from-amber-400 to-amber-600', activo: true,
};

function StaffTab() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'profesionales'),
      (snap) => { setStaff(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); setLoading(false); },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const openAdd = () => { setEditing(null); setForm(EMPTY_MEMBER); setFormMode('add'); };
  const openEdit = (member) => {
    setEditing(member);
    setForm({
      nombre:       member.name         || '',
      rol:          member.role         || '',
      especialidad: member.specialty    || '',
      bio:          member.bio          || '',
      color:        member.color        || 'from-amber-400 to-amber-600',
      activo:       member.activo !== false,
    });
    setFormMode('edit');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) return;
    setSaving(true);
    const payload = {
      name:      form.nombre.trim(),
      role:      form.rol.trim(),
      specialty: form.especialidad.trim(),
      bio:       form.bio.trim(),
      avatar:    form.nombre.trim().charAt(0).toUpperCase(),
      color:     form.color,
      activo:    form.activo,
    };
    try {
      if (formMode === 'add') await addDoc(collection(db, 'profesionales'), payload);
      else                    await updateDoc(doc(db, 'profesionales', editing.id), payload);
      setFormMode(null);
    } catch { alert('Error al guardar. Intentá de nuevo.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`¿Eliminar a "${member.name}"? Esta acción no se puede deshacer.`)) return;
    try { await deleteDoc(doc(db, 'profesionales', member.id)); }
    catch { alert('Error al eliminar. Intentá de nuevo.'); }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Staff</h2>
        {!formMode && (
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all"
          >
            + Agregar miembro
          </button>
        )}
      </div>

      {/* Formulario */}
      {formMode && (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-700/60 rounded-2xl p-6 mb-6 space-y-4">
          <h3 className="text-base font-bold text-white">
            {formMode === 'add' ? 'Nuevo miembro' : 'Editar miembro'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Nombre *</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                placeholder="Ej: Mateo"
                required
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Rol</label>
              <input
                type="text"
                value={form.rol}
                onChange={(e) => set('rol', e.target.value)}
                placeholder="Ej: Barbero Senior"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Especialidad</label>
              <input
                type="text"
                value={form.especialidad}
                onChange={(e) => set('especialidad', e.target.value)}
                placeholder="Ej: Degradados y diseños"
                className={INPUT_CLS}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="Breve descripción del profesional"
              rows={2}
              className={`${INPUT_CLS} resize-none`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Color de avatar</label>
            <div className="flex flex-wrap gap-2">
              {GRADIENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('color', opt.value)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    form.color === opt.value
                      ? 'border-amber-500 text-white bg-zinc-800'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${opt.value} flex-shrink-0`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => set('activo', e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <span className="text-sm text-zinc-300">Activo (visible en el sitio y disponible para reservas)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormMode(null)}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white text-sm font-semibold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-zinc-800/60 animate-pulse" />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-zinc-400">No hay miembros registrados. Agregá el primero.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-left">
                {['Miembro', 'Rol', 'Especialidad', 'Estado', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-amber-400 first:pl-5 last:pr-5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member, idx) => (
                <tr
                  key={member.id}
                  className={`border-b border-zinc-800/60 hover:bg-zinc-800/30 transition-colors ${
                    idx % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/40'
                  }`}
                >
                  <td className="px-4 py-3 pl-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${member.color || 'from-zinc-600 to-zinc-800'} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                        {member.avatar}
                      </div>
                      <span className="text-white font-semibold">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{member.role}</td>
                  <td className="px-4 py-3 text-zinc-400">{member.specialty}</td>
                  <td className="px-4 py-3">
                    {member.activo !== false
                      ? <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">Activo</span>
                      : <span className="text-xs bg-zinc-700/40 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full font-semibold">Inactivo</span>}
                  </td>
                  <td className="px-4 py-3 pr-5">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => openEdit(member)}
                        className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-lg px-2.5 py-1 transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(member)}
                        className="text-xs font-semibold text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 rounded-lg px-2.5 py-1 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

// ─── AdminPanel root ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'turnos',    label: 'Turnos'    },
  { id: 'servicios', label: 'Servicios' },
  { id: 'staff',     label: 'Staff'     },
];

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('turnos');

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Scissors className="w-6 h-6 text-amber-400 flex-shrink-0" />
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

      {/* Tabs */}
      <div className="bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-1 pt-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-t-xl text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-zinc-950 text-white border border-b-transparent border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {activeTab === 'turnos'    && <TurnosTab />}
        {activeTab === 'servicios' && <ServiciosTab />}
        {activeTab === 'staff'     && <StaffTab />}
      </main>
    </div>
  );
}
