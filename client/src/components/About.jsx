import React from 'react';
import { Sun, Trees, Compass, Sparkles, ShieldCheck, Clock } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-stone-50 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            <span>Identità & Territorio</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            Cos'è la Serra dei Giardini Baden-Powell?
          </h2>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Un luogo unico a Savona, dove natura, architettura storica e rigenerazione urbana 
            convivono armoniosamente all'interno della collina della Villetta.
          </p>
        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Image & Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1000&q=80"
                alt="Collezione cactacee serra Baden Powell Savona"
                className="w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Via Pietro Amendola • Savona
                </span>
                <p className="font-serif text-lg font-bold">
                  Custodi di oltre 700 specie cactacee e succulente
                </p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 p-4 rounded-2xl bg-white shadow-xl border border-stone-200 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Clock className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-stone-900">Visite del Giovedì</p>
                <p className="text-stone-500">Accesso esclusivamente guidato dalle 14:00 alle 17:00.</p>
              </div>
            </div>
          </div>

          {/* Text & Feature Points */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed space-y-4">
              <p className="text-lg font-medium text-emerald-950">
                All'interno dei <strong>Giardini Robert Baden-Powell</strong>, nel quartiere della Villetta a Savona, 
                sorge una delle serre botaniche dedicate alle piante grasse più affascinanti della Liguria.
              </p>
              <p>
                La serra custodisce la storica e prestigiosa <strong>collezione Caroggio</strong>: oltre 700 esemplari 
                provenienti da habitat desertici e semidesertici di tutti i continenti, con specie secolari di 
                straordinario interesse morfologico ed ecologico.
              </p>
              <p>
                Oggi lo spazio è un prezioso <strong>bene comune fruibile dalla collettività</strong> attraverso 
                visite guidate che permettono di conoscere la biologia delle piante xerofite, la corretta coltivazione 
                e la memoria storica della città di Savona.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                  <Trees className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Oasi Botanica</h4>
                <p className="text-xs text-stone-600">Specie protette e cactacee rare conservate in un microclima protetto.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Valore Scientifico</h4>
                <p className="text-xs text-stone-600">Catalogazione specialistica curata dal botanico dott. Alessandro Guiggi.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm hover:border-emerald-300 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Cura Partecipata</h4>
                <p className="text-xs text-stone-600">Presidio civico e accoglienza garantita da volontari e operatori.</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
