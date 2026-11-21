import React from 'react';
import { History as HistoryIcon, Award, Heart, Sparkles, BookCheck } from 'lucide-react';

export default function History() {
  const timelineSteps = [
    {
      year: "Anni '70 - '90",
      title: "La Passione del Dott. Alberto Caroggio",
      desc: "Il dottor Alberto Caroggio, stimato medico savonese e socio appassionato dell'A.A.P.S. (Associazione Amatori Piante Succulente), raccoglie e coltiva con dedizione oltre 700 varietà di cactacee e succulente rare provenienti da tutti i continenti.",
      icon: Heart,
      tag: "Origini"
    },
    {
      year: "La Donazione",
      title: "Un Regalo Inestimabile alla Città di Savona",
      desc: "Alla scomparsa del dott. Caroggio, la famiglia decide generosamente di donare l'intera collezione alla comunità savonese, affinché la serra diventi un bene fruibile da studenti, ricercatori e cittadini.",
      icon: Award,
      tag: "Donazione Civica"
    },
    {
      year: "Lo Studio Scientifico",
      title: "La Catalogazione del Dott. Alessandro Guiggi",
      desc: "Il prestigioso botanico e cactologo Alessandro Guiggi (ricercatore già attivo presso i celebri Giardini Botanici Hanbury) redige il catalogo botanico ufficiale della collezione, classificando scientificamente le centinaia di specie presenti.",
      icon: BookCheck,
      tag: "Ricerca Botanica"
    },
    {
      year: "Oggi: Giardinetti 365",
      title: "Rinascita, Auser & Isforcoop",
      desc: "Dopo anni di abbandono e chiusura, il Comune di Savona avvia il Patto di Collaborazione Civica 'Giardinetti 365' con Auser Savona OdV e Isforcoop ETS. La serra rinasce come presidio di formazione, cura del verde e solidarietà intergenerazionale.",
      icon: Sparkles,
      tag: "Rigenerazione Urbana"
    }
  ];

  return (
    <section id="history" className="py-20 bg-stone-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <HistoryIcon className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Memoria & Radici</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            La Storia: dalla Passione Privata al Bene Comune
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Quarant’anni di devozione botanica, un atto di donazione d'amore verso Savona 
            e una grande storia di riscatto partecipato.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-0.5 bg-stone-300" />

          <div className="space-y-12 lg:space-y-16">
            {timelineSteps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const StepIcon = step.icon;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                    isEven ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Badge in Center */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-emerald-600 shadow-md items-center justify-center text-emerald-700 z-10">
                    <StepIcon className="w-5 h-5" />
                  </div>

                  {/* Content Card */}
                  <div className="w-full lg:w-[calc(50%-3rem)]">
                    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                      
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-botanical-50 text-botanical-700 border border-botanical-200">
                          {step.tag}
                        </span>
                        <span className="font-serif font-bold text-stone-400 text-sm">
                          {step.year}
                        </span>
                      </div>

                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-3 group-hover:text-botanical-700 transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Empty side for balance on desktop */}
                  <div className="hidden lg:block w-[calc(50%-3rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quote Callout */}
        <div className="mt-16 p-8 rounded-3xl bg-emerald-900 text-white text-center max-w-4xl mx-auto shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-emerald-700/30 rounded-full blur-2xl" />
          <p className="font-serif italic text-lg sm:text-xl text-emerald-100 mb-3 leading-relaxed">
            "Questa serra è il simbolo tangibile di come la passione di un singolo cittadino 
            possa trasformarsi in una cattedrale verde di conoscenza, aperta a tutti."
          </p>
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            Dalla catalogazione scientifica curata dal Dott. Alessandro Guiggi
          </div>
        </div>

      </div>
    </section>
  );
}
