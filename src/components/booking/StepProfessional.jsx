import { PROFESSIONALS } from '../../data/businessData.js';

/**
 * Paso 1: El cliente elige con qué profesional quiere atenderse.
 */
export default function StepProfessional({ selected, onSelect }) {
  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Elegí tu profesional</h3>
      <p className="text-zinc-400 text-sm mb-6">¿Con quién querés hacer tu reserva?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PROFESSIONALS.map((pro) => {
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
    </div>
  );
}
