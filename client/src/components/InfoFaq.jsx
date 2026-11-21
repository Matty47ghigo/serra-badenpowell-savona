import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MapPin, Bus, Car, Footprints, Clock, ExternalLink } from 'lucide-react';
import { GREENHOUSE_DATA } from '../data/greenhouseData';

export default function InfoFaq() {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section id="info-faq" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Guida al Visitatore</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            Come Raggiungerci & Domande Frequenti
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Tutte le informazioni pratiche per partecipare alle visite guidate del giovedì 
            nel quartiere della Villetta a Savona.
          </p>
        </div>

        {/* 2-Column: Map/Directions on Left, FAQs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Directions & Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200 shadow-sm space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-stone-900">
                    Giardini Robert Baden-Powell
                  </h3>
                  <p className="text-stone-600 text-sm mt-0.5">
                    Via Pietro Amendola, Quartiere Villetta, 17100 Savona (SV)
                  </p>
                  <a
                    href="https://maps.google.com/?q=Giardini+Robert+Baden+Powell+Savona"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 mt-2 hover:underline"
                  >
                    <span>Apri su Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-stone-200 text-sm">
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block text-xs">Orari di Visita Esclusivi:</strong>
                    <span className="text-stone-600 text-xs">
                      Solo ogni <strong>Giovedì pomeriggio dalle 14:00 alle 17:00</strong> con visita guidata su prenotazione online.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Footprints className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block text-xs">A piedi dal centro di Savona:</strong>
                    <span className="text-stone-600 text-xs">
                      Circa 15 minuti di passeggiata panoramica salendo da Piazza del Popolo o dalla stazione ferroviaria FS.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block text-xs">In Autobus urbano TPL:</strong>
                    <span className="text-stone-600 text-xs">
                      Linee urbane 1 o 3 dalla stazione ferroviaria, scendendo alla fermata <em>Villetta / Via Amendola</em>.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Car className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block text-xs">In Automobile:</strong>
                    <span className="text-stone-600 text-xs">
                      Parcheggi disponibili lungo Via Amendola e le vie residenziali adiacenti al parco.
                    </span>
                  </div>
                </div>

              </div>

              {/* Savona Riviera card */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 relative aspect-video bg-emerald-950 text-white p-5 flex flex-col justify-end shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80"
                  alt="Dettaglio piante succulente e luce"
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Oasi Verde di Savona
                  </span>
                  <p className="font-serif font-bold text-sm sm:text-base text-white">
                    Un'atmosfera mediterranea e desertica unica nel panorama ligure
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">
              Domande Più Frequenti
            </h3>

            {GREENHOUSE_DATA.faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-200 bg-white transition-all overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <span className="font-serif font-bold text-stone-900 text-base sm:text-lg">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
