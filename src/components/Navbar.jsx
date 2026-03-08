import { useState, useEffect } from 'react';
import { Scissors } from 'lucide-react';
import { BUSINESS_INFO } from '../data/businessData.js';

export default function Navbar({ onOpenMyBookings }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cambia el estilo del nav al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#equipo', label: 'Equipo' },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800 shadow-xl' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 group">
          <Scissors className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <span className="font-display text-lg font-bold tracking-wide text-white group-hover:text-amber-400 transition-colors">
            {BUSINESS_INFO.name}
          </span>
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-zinc-300 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={onOpenMyBookings}
              className="text-sm font-semibold px-4 py-1.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-all"
            >
              Mis Turnos
            </button>
          </li>
        </ul>

        {/* Hamburger mobile */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 text-zinc-300 hover:text-white"
          aria-label="Abrir menú"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-zinc-900 border-t border-zinc-800 animate-fade-in">
          <ul className="flex flex-col px-4 py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-base font-medium text-zinc-200 hover:text-amber-400 transition-colors py-1"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setMenuOpen(false); onOpenMyBookings(); }}
                className="w-full text-left text-base font-semibold text-zinc-200 hover:text-white py-1 transition-colors"
              >
                Mis Turnos
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
