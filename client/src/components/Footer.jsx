import React from 'react';
import { ArrowUp, Instagram, Facebook, Heart, MapPin, ShieldCheck, Clock } from 'lucide-react';

export default function Footer({ onOpenAuth }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const officialFacebook = "https://www.facebook.com/share/1DtFrn6KFS/?mibextid=wwXIfr";
  const officialInstagram = "https://www.instagram.com/serrabadenpowell";

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Brand Info with Real Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md">
                <img
                  src="/logo.png"
                  alt="Logo Serra Baden-Powell Savona"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-serif font-bold text-xl text-white">
                Serra Baden-Powell Savona
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              Oasi botanica e polo di inclusione sociale nel cuore della Villetta a Savona. 
              Oltre 700 cactacee della collezione storica Caroggio, aperte per visite guidate esclusive ogni giovedì pomeriggio.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={officialInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-stone-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-pink-600 text-stone-300 hover:text-white flex items-center justify-center transition-all border border-stone-800 shadow-sm"
                title="Instagram @serrabadenpowell"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={officialFacebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-2xl bg-stone-900 hover:bg-blue-600 text-stone-300 hover:text-white flex items-center justify-center transition-all border border-stone-800 shadow-sm"
                title="Pagina Ufficiale Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Esplora
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">Cos'è la Serra</a></li>
              <li><a href="#history" className="hover:text-emerald-400 transition-colors">Storia & Donazione</a></li>
              <li><a href="#botanical" className="hover:text-emerald-400 transition-colors">Catalogo Piante</a></li>
              <li><a href="#social-project" className="hover:text-emerald-400 transition-colors">Progetto Sociale</a></li>
              <li><a href="#partners" className="hover:text-emerald-400 transition-colors">Partner Ufficiali</a></li>
              <li><a href="#booking" className="hover:text-emerald-400 transition-colors font-bold text-emerald-400">Prenota Visita (Giovedì)</a></li>
            </ul>
          </div>

          {/* Partners */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Rete di Collaborazione
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Comune di Savona</li>
              <li>Auser Savona OdV</li>
              <li>Isforcoop ETS</li>
              <li>Fondazione De Mari</li>
              <li>Famiglia Alberto Caroggio</li>
              <li>Catalogo Dott. Alessandro Guiggi</li>
            </ul>
          </div>

          {/* Location & Info (NO EMAIL ADDRESS) */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-white text-sm uppercase tracking-wider">
              Dove Siamo
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Via Pietro Amendola, Quartiere Villetta, 17100 Savona SV</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Visite Guidate: Giovedì 14:00 - 17:00</span>
              </p>
            </div>
            
            <div className="pt-4">
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs text-stone-300 hover:text-emerald-400 transition-colors border border-stone-800 font-semibold"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Accesso Gestione Staff</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="flex items-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Serra dei Giardini Robert Baden-Powell Savona. Patto civico</span>
            <span className="font-semibold text-stone-400">#Giardinetti365</span>.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors border border-stone-800"
          >
            <span>Torna in alto</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
