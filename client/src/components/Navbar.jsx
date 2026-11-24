import React, { useState } from "react";
import {
  Menu,
  X,
  CalendarCheck,
  ShieldCheck,
  Instagram,
  Facebook,
} from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand with Real Image */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl sm:rounded-2xl bg-white border border-stone-200 p-0.5 sm:p-1 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <img
                src="/logo.png"
                alt="Logo Serra Baden-Powell Savona"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-serif font-bold text-sm sm:text-base md:text-lg text-botanical-950 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
                Serra Baden-Powell
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium tracking-wider uppercase mt-1 flex items-center gap-1 sm:gap-1.5">
                <span>Villetta • Savona</span>
                <span className="w-1 h-1 rounded-full bg-emerald-600"></span>
                <span className="text-emerald-700 font-semibold">
                  Giovedì 14-17
                </span>
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
          <div className="hidden sm:flex items-center gap-2 md:gap-3">
            <button
              onClick={onOpenAuth}
              title="Area Riservata (Staff, Volontari, Admin)"
              className="px-3 py-2 text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-xl transition-colors text-xs flex items-center gap-1.5 font-semibold border border-stone-200"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Area Staff</span>
            </button>

            <a
              href="#booking"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Prenota Visita</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-1.5 xl:hidden">
            <button
              onClick={onOpenAuth}
              className="p-2 text-stone-600 hover:text-emerald-800 border border-stone-200 rounded-xl bg-white/70"
              title="Area Staff"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-stone-700 hover:text-emerald-800 hover:bg-stone-100 rounded-xl focus:outline-none bg-white/70 border border-stone-200"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 top-16 sm:top-20 bg-black/40 backdrop-blur-sm z-40 xl:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-50 xl:hidden bg-white border-b border-stone-200 px-4 pt-3 pb-6 space-y-1 shadow-2xl animate-fadeIn max-h-[calc(100vh-4rem)] overflow-y-auto">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3.5 py-3 rounded-xl text-sm font-semibold text-stone-800 hover:bg-emerald-50 active:bg-emerald-100 hover:text-emerald-800 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <a
                href="#booking"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-center shadow-md transition-colors text-sm"
              >
                <CalendarCheck className="w-5 h-5" />
                <span>Prenota Visita Guidata (Giovedì)</span>
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
