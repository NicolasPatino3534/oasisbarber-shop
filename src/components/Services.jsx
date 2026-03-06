import { SERVICES } from '../data/businessData.js';

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-4 bg-zinc-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Lo que ofrecemos
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Cada servicio está diseñado para que salgas sintiéndote y viéndote en tu mejor versión.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className={`relative group bg-zinc-800 hover:bg-zinc-800/80 border rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 ${
                service.popular
                  ? 'border-amber-500/60 hover:border-amber-400'
                  : 'border-zinc-700/50 hover:border-zinc-600'
              }`}
            >
              {/* Badge popular */}
              {service.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-zinc-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Más popular
                </div>
              )}

              {/* Icono */}
              <div className="text-3xl mb-4">{service.icon}</div>

              {/* Nombre */}
              <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>

              {/* Descripción */}
              <p className="text-sm text-zinc-400 leading-relaxed flex-1">{service.description}</p>

              {/* Separador */}
              <div className="h-px bg-zinc-700/50 my-4" />

              {/* Precio + duración */}
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-3xl font-black text-amber-400">${service.price}</span>
                </div>
                <div className="text-xs text-zinc-500 text-right">
                  <span>⏱ {service.duration} min</span>
                </div>
              </div>

              {/* CTA inline */}
              <a
                href="#reservar"
                className={`mt-4 block w-full text-center text-sm font-bold py-2.5 rounded-xl transition-all ${
                  service.popular
                    ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                    : 'bg-zinc-700 hover:bg-zinc-600 text-white'
                }`}
              >
                Reservar
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
