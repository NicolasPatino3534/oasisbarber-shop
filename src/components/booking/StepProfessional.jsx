import { useBusinessData } from '../../hooks/useBusinessData.js';

function Spinner() {
  return (
    <div className="flex items-center justify-center py-12 gap-3 text-zinc-400">
      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="text-sm">Cargando profesionales...</span>
    </div>
  );
}

/**
 * Paso 1: El cliente elige con qué profesional quiere atenderse.
 * Solo muestra profesionales con activo !== false.
 */
export default function StepProfessional({ selected, onSelect }) {
  const { professionals, loading } = useBusinessData();
  const active = professionals.filter((p) => p.activo !== false);

  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Elegí tu profesional</h3>
      <p className="text-zinc-400 text-sm mb-6">¿Con quién querés hacer tu reserva?</p>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {active.map((pro) => {
            const isSelected = selected?.id === pro.id;
            return (
              <button
                key={pro.id}
                onClick={() => onSelect(pro)}
                className={`group relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-500 hover:bg-zinc-800'
                }`}
              >
                {/* Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-zinc-950 text-xs font-black">
                    ✓
                  </div>
                )}

                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${pro.color} flex items-center justify-center text-white text-2xl font-black mb-3 transition-transform group-hover:scale-105`}>
                  {pro.avatar}
                </div>

                <span className="text-white font-bold text-lg">{pro.name}</span>
                <span className="text-amber-400 text-xs font-semibold mt-0.5">{pro.role}</span>
                <span className="text-zinc-500 text-xs mt-1">{pro.specialty}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
