import { Scissors, MapPin, Phone, Mail, Heart } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Scissors className="w-6 h-6 text-amber-400 flex-shrink-0" />
              <span className="font-display text-lg font-bold text-white">{BUSINESS_INFO.name}</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Peluquería y barbería premium en el corazón de la ciudad.
              Estilo, precisión y confianza en cada corte.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-zinc-500" />
                {BUSINESS_INFO.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-zinc-500" />
                {BUSINESS_INFO.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-zinc-500" />
                {BUSINESS_INFO.email}
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Horarios</h4>
            <p className="text-sm text-zinc-400">{BUSINESS_INFO.hours}</p>
            <p className="text-xs text-zinc-600 mt-1">Domingos: Cerrado</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600">
          <p>© {year} {BUSINESS_INFO.name}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 mx-0.5" /> y mucho estilo.
          </p>
        </div>
      </div>
    </footer>
  );
}
