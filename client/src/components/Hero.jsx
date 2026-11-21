import React from 'react';
import { Calendar, ArrowDown, Sparkles, MapPin, Tv, ExternalLink } from 'lucide-react';
import { GREENHOUSE_DATA } from '../data/greenhouseData';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image with High Quality Visuals */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=2200&q=85"
          alt="Serra delle piante succulente Giardini Baden Powell Savona"
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-900/85 to-emerald-950/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-900/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-medium">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Giardini Robert Baden-Powell • Savona (Villetta)</span>
          </div>

          {/* Clickable RAI 1 - LINEA VERDE BADGE */}
          <a
            href={GREENHOUSE_DATA.general.raiPlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/30 to-emerald-500/30 hover:from-amber-500/40 hover:to-emerald-500/40 backdrop-blur-md border border-amber-300/40 text-amber-200 hover:text-white text-xs sm:text-sm font-bold shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <Tv className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>In onda su Rai 1 • Linea Verde</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-50 max-w-4xl mx-auto leading-tight mb-6">
          La Serra delle <br className="hidden sm:inline" />
          <span className="italic font-normal text-emerald-300">Piante Succulente</span> di Savona
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-stone-200 max-w-3xl mx-auto font-light leading-relaxed mb-10">
          Un prezioso patrimonio botanico di oltre <strong>700 cactacee rare</strong> della donazione storica Caroggio.
          Aperta al pubblico per <strong>visite guidate esclusive ogni giovedì dalle 14:00 alle 17:00</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold shadow-xl hover:shadow-emerald-900/40 transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-5 h-5" />
            <span>Prenota la Visita Guidata (Giovedì)</span>
          </a>

          <a
            href="#botanical"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-base font-semibold backdrop-blur-md border border-white/25 transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <span>Catalogo Botanico</span>
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {GREENHOUSE_DATA.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left hover:bg-white/15 transition-all duration-300"
            >
              <div className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-300 mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white mb-1">
                {stat.label}
              </div>
              <div className="text-[11px] sm:text-xs text-stone-300 leading-snug">
                {stat.desc}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/60 animate-bounce">
        <a href="#about" aria-label="Scorri ai contenuti">
          <ArrowDown className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}
