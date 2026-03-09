import { Scissors, Calendar, MapPin, Clock } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData.js';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden pb-20"
    >
      {/* Fondo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950" />

      {/* Círculos decorativos de fondo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Líneas decorativas verticales */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl mx-auto animate-slide-up pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6 sm:mb-8">
          <Scissors className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Peluquería &amp; Barbería Premium</span>
        </div>

        {/* Título principal */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none mb-4">
          Oasis
          <br />
          <span className="text-amber-400">Hair</span>
          <span className="text-white"> &amp; </span>
          <span className="text-amber-400">Beard</span>
        </h1>

        {/* Tagline */}
        <p className="text-zinc-400 text-lg sm:text-xl font-light tracking-widest uppercase mb-3">
          {BUSINESS_INFO.tagline}
        </p>

        {/* Separador */}
        <div className="flex items-center gap-4 justify-center my-6 sm:my-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/60" />
          <span className="text-amber-500 text-xl">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        {/* Descripción */}
        <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          El lugar donde el estilo se encuentra con la precisión. Reservá tu turno
          con nuestros profesionales y transformá tu imagen hoy.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#reservar"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-base px-8 py-4 rounded-full transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
          >
            <Calendar className="w-5 h-5 flex-shrink-0" />
            Reservar Turno Ahora
          </a>
          <a
            href="#servicios"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-700 hover:border-amber-500/50 text-zinc-300 hover:text-white font-medium text-base px-8 py-4 rounded-full transition-all hover:-translate-y-0.5"
          >
            Ver Servicios
          </a>
        </div>

        {/* Info rápida */}
        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>{BUSINESS_INFO.address}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>{BUSINESS_INFO.hours}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
