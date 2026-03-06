import { SERVICES } from '../../data/businessData.js';

/**
 * Paso 2: El cliente elige el servicio que desea.
 */
export default function StepService({ selected, professional, onSelect }) {
  return (
    <div className="step-enter">
      <h3 className="text-xl font-bold text-white mb-2">Elegí tu servicio</h3>
      <p className="text-zinc-400 text-sm mb-6">
        ¿Qué servicio vas a realizar con{' '}
        <span className="text-amber-400 font-semibold">{professional?.name}</span>?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICES.map((service) => {
          const isSelected = selected?.id === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`relative flex items-start gap-4 text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                  : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-500 hover:bg-zinc-800'
              }`}
            >
              {/* Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-zinc-950 text-xs font-black flex-shrink-0">
                  ✓
                </div>
              )}

              {/* Badge popular */}
              {service.popular && !isSelected && (
                <div className="absolute top-3 right-3 bg-zinc-700 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  Popular
                </div>
              )}

              {/* Icono */}
              <span className="text-2xl flex-shrink-0 mt-0.5">{service.icon}</span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-bold text-white">{service.name}</span>
                  <span className="text-amber-400 font-black text-lg">${service.price}</span>
                </div>
                <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{service.description}</p>
                <p className="text-zinc-600 text-xs mt-1">⏱ {service.duration} minutos</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
