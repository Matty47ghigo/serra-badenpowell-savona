import React from 'react';
import { Calendar, ArrowDown, Sparkles, MapPin, Tv, ExternalLink } from 'lucide-react';
import { GREENHOUSE_DATA } from '../data/greenhouseData';

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-hidden">
      {/* Background Image with High Quality Visuals */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/serra/serra-2.jpg"
          alt="Serra delle piante succulente Giardini Baden Powell Savona"
          onError={(e) => { if (!e.currentTarget.src.includes('serra-1')) e.currentTarget.src = '/images/serra/serra-1.jpg'; }}
          className="w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-emerald-950/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-black/40 to-stone-950/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-stone-950/60 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs md:text-sm font-medium shadow-md">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>Giardini Robert Baden-Powell • Savona (Villetta)</span>
          </div>

          {/* Clickable RAI 1 - LINEA VERDE BADGE */}
          <a
            href={GREENHOUSE_DATA.general.raiPlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/40 to-emerald-500/40 hover:from-amber-500/55 hover:to-emerald-500/55 backdrop-blur-md border border-amber-300/50 text-amber-200 hover:text-white text-[11px] sm:text-xs md:text-sm font-bold shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span>In onda su Rai 1 • Linea Verde</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
          </a>
        </div>

        {/* Main Title */}
        <h1 className="font-serif text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-50 max-w-4xl mx-auto leading-tight mb-4 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          La Serra delle <br className="hidden sm:inline" />
          <span className="italic font-normal text-emerald-300">Piante Succulente</span> di Savona
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-stone-100 max-w-3xl mx-auto font-normal leading-relaxed mb-8 sm:mb-10 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-2">
          Un prezioso patrimonio botanico di oltre <strong>700 cactacee rare</strong> della donazione storica Caroggio.
          Aperta al pubblico per <strong>visite guidate esclusive ogni giovedì dalle 14:00 alle 17:00</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 max-w-md sm:max-w-none mx-auto w-full">
          <a
            href="#booking"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 sm:gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm sm:text-base font-bold shadow-xl hover:shadow-emerald-900/40 transition-all duration-300 hover:scale-105"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Prenota Visita Guidata (Giovedì)</span>
          </a>

          <a
            href="#botanical"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-semibold backdrop-blur-md border border-white/25 transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            <span>Catalogo Botanico</span>
          </a>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 max-w-5xl mx-auto">
          {GREENHOUSE_DATA.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left hover:bg-white/15 transition-all duration-300"
            >
              <div className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-300 mb-0.5 sm:mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white mb-0.5 sm:mb-1">
                {stat.label}
              </div>
              <div className="text-[10px] sm:text-xs text-stone-300 leading-snug line-clamp-2">
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
