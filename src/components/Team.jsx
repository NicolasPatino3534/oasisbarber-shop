import { PROFESSIONALS } from '../data/businessData.js';

export default function Team() {
  return (
    <section id="equipo" className="py-24 px-4 bg-zinc-950">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
            Conocé a quienes te dan el mejor look
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
            Nuestro Equipo
          </h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Profesionales apasionados por su oficio, listos para darte la atención que merecés.
          </p>
        </div>

        {/* Cards del equipo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {PROFESSIONALS.map((pro) => (
            <article
              key={pro.id}
              className="group text-center bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40"
            >
              {/* Avatar */}
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${pro.color} flex items-center justify-center text-white text-3xl font-black mx-auto mb-5 ring-4 ring-zinc-800 group-hover:ring-amber-500/30 transition-all`}>
                {pro.avatar}
              </div>

              {/* Info */}
              <h3 className="text-xl font-bold text-white mb-1">{pro.name}</h3>
              <p className="text-amber-400 text-sm font-semibold mb-1">{pro.role}</p>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-4">{pro.specialty}</p>

              {/* Separador */}
              <div className="h-px bg-zinc-800 mb-4" />

              {/* Bio */}
              <p className="text-zinc-400 text-sm leading-relaxed">{pro.bio}</p>

              {/* CTA */}
              <a
                href="#reservar"
                className="mt-6 inline-block text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors"
              >
                Reservar con {pro.name} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
