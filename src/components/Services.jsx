import { Scissors, Timer } from 'lucide-react';
import { useBusinessData } from '../hooks/useBusinessData.js';

function ServiceSkeleton() {
  return (
    <div className="bg-zinc-800 border border-zinc-700/50 rounded-2xl p-6 animate-pulse">
      <div className="w-9 h-9 bg-zinc-700 rounded-lg mb-4" />
      <div className="h-5 bg-zinc-700 rounded mb-2 w-2/3" />
      <div className="space-y-1.5 mb-4">
        <div className="h-3 bg-zinc-700/60 rounded" />
        <div className="h-3 bg-zinc-700/60 rounded w-5/6" />
        <div className="h-3 bg-zinc-700/60 rounded w-4/6" />
      </div>
      <div className="h-px bg-zinc-700/50 my-4" />
      <div className="flex justify-between items-end">
        <div className="h-8 w-16 bg-zinc-700 rounded" />
        <div className="h-3 w-16 bg-zinc-700/60 rounded" />
      </div>
      <div className="h-9 bg-zinc-700/60 rounded-xl mt-4" />
    </div>
  );
}

export default function Services() {
  const { services, loading } = useBusinessData();

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
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <ServiceSkeleton key={i} />)
            : services.map((service) => (
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
                  <div className="mb-4">
                    <Scissors className="w-8 h-8 text-amber-400" />
                  </div>

                  {/* Nombre */}
                  <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>

                  {/* Descripción */}
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">{service.description}</p>

                  {/* Separador */}
                  <div className="h-px bg-zinc-700/50 my-4" />

                  {/* Precio + duración */}
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-black text-amber-400">${service.price}</span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {service.duration} min</span>
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
