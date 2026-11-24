import React from "react";
import { HeartHandshake, CheckCircle2, Tv, ExternalLink } from "lucide-react";
import { GREENHOUSE_DATA } from "../data/greenhouseData";

export default function SocialProject() {
  return (
    <section
      id="social-project"
      className="py-20 sm:py-28 bg-stone-100/70 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>Patto di Collaborazione Civica</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            La Gestione & Il Progetto Sociale
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            La Serra dei Giardini Baden-Powell è il cuore pulsante di{" "}
            <strong>#Giardinetti365</strong>: un modello virtuoso di
            rigenerazione urbana, cura intergenerazionale e valorizzazione dei
            beni comuni.
          </p>
        </div>

        {/* Feature Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
              Cura del bene comune attraverso il{" "}
              <span className="text-emerald-700 italic">Learning by Doing</span>
            </h3>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              Grazie al Patto di Collaborazione Civica sottoscritto tra il{" "}
              <strong>Comune di Savona</strong>,
              <strong> Auser Savona OdV</strong> e{" "}
              <strong>Isforcoop ETS</strong>, la serra è rinata come uno spazio
              di formazione viva e inclusione socio-lavorativa.
            </p>

            <ul className="space-y-4 pt-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-stone-700">
                  <strong>Inclusione socio-lavorativa:</strong> Percorsi pratici
                  dedicati a giovani e persone con disabilità o fragilità, che
                  apprendono le tecniche di riproduzione per talea, rinvaso e
                  cura delle cactacee.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-stone-700">
                  <strong>Patto Intergenerazionale:</strong> I volontari senior
                  di Auser e i giovani allievi di Isforcoop condividono
                  quotidianamente la gestione della serra e l'accoglienza dei
                  visitatori.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-stone-700">
                  <strong>Presidio Aperto alla Città:</strong> Ogni giovedì
                  pomeriggio i visitatori possono entrare in contatto con questo
                  progetto vivente e ammirare la collezione guidati dai
                  volontari.
                </span>
              </li>
            </ul>

            {/* Clickable Linea Verde Banner */}
            <a
              href={GREENHOUSE_DATA.general.raiPlayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 p-5 rounded-3xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/90 flex items-center justify-between gap-4 hover:shadow-lg hover:border-amber-400 transition-all duration-300 group block"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                      Rai 1 • Televisione Nazionale
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-stone-900 mt-1">
                    Guarda il servizio su Linea Verde Italia
                  </h4>
                  <p className="text-xs text-stone-600">
                    Clicca per rivedere la puntata ufficiale su RaiPlay dedicata
                    a Savona e alla serra.
                  </p>
                </div>
              </div>
              <ExternalLink className="w-5 h-5 text-stone-400 group-hover:text-stone-800 transition-colors shrink-0" />
            </a>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative">
              <img
                src="/images/serra/serra-3.jpg"
                alt="Volontari e operatori del patto civico nella serra"
                onError={(e) => { if (!e.currentTarget.src.includes('serra-1')) e.currentTarget.src = '/images/serra/serra-1.jpg'; }}
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                  Solidarietà & Ambiente
                </span>
                <p className="font-serif text-xl sm:text-2xl font-bold mt-1">
                  "Un luogo dove ogni pianta racconta una storia di riscatto e
                  appartenenza."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
