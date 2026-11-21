import React, { useState } from 'react';
import { Menu, X, CalendarCheck, ShieldCheck, Instagram, Facebook } from 'lucide-react';

export default function Navbar({ onOpenAuth }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Cos'è la Serra", href: "#about" },
    { label: "Storia & Donazione", href: "#history" },
    { label: "Catalogo Piante", href: "#botanical" },
    { label: "Progetto Sociale", href: "#social-project" },
    { label: "Partner", href: "#partners" },
    { label: "Galleria", href: "#gallery" },
    { label: "Social", href: "#social-feed" },
    { label: "Info & FAQ", href: "#info-faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-stone-200/70 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand with Real Image */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white border border-stone-200 p-1 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Logo Serra Baden-Powell Savona"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-base sm:text-lg text-botanical-950 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                Serra Baden-Powell
              </div>
              <div className="text-[11px] text-stone-500 font-medium tracking-wider uppercase mt-1 flex items-center gap-1.5">
                <span>Villetta • Savona</span>
                <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                <span className="text-emerald-700 font-semibold">Giovedì 14-17</span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-emerald-800 hover:bg-emerald-50/80 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              title="Area Riservata (Staff, Volontari, Admin)"
              className="px-3.5 py-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors text-xs flex items-center gap-1.5 font-semibold border border-stone-200"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Area Staff</span>
            </button>

            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Prenota Visita Guidata</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenAuth}
              className="p-2 text-stone-600 hover:text-emerald-800 border border-stone-200 rounded-xl"
              title="Area Staff"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-xl focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="xl:hidden bg-white/98 backdrop-blur-xl border-b border-stone-200 px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50 hover:text-emerald-800 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <a
              href="#booking"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center shadow-md transition-colors"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>Prenota Visita Guidata (Giovedì)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
