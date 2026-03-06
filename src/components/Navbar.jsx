import { useState, useEffect } from 'react';
import { BUSINESS_INFO } from '../data/businessData.js';

export default function Navbar() {
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
    { href: '#reservar', label: 'Reservar' },
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
          <span className="text-2xl">💈</span>
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
        </ul>

        {/* CTA desktop */}
        <a
          href="#reservar"
          className="hidden md:inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm px-5 py-2 rounded-full transition-colors"
        >
          Reservar Turno
        </a>

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
              <a
                href="#reservar"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm px-5 py-3 rounded-full transition-colors"
              >
                Reservar Turno
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
