import React from 'react';
import { Building2, HeartHandshake, Users, Sparkles, Award } from 'lucide-react';
import { GREENHOUSE_DATA } from '../data/greenhouseData';

export default function PartnersSection() {
  const iconMap = {
    Landmark: Building2,
    HeartHandshake: HeartHandshake,
    Users: Users,
    Sparkles: Sparkles,
    Award: Award
  };

  return (
    <section id="partners" className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Rete Istituzionale & Terzo Settore</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            Partner & Collaboratori Ufficiali
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            La Serra dei Giardini Baden-Powell è il frutto di un'alleanza solida tra enti pubblici, 
            associazioni di volontariato, formazione professionale e mecenatismo civico.
          </p>
        </div>

        {/* Partners Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {GREENHOUSE_DATA.partners.map((partner, idx) => {
            const IconComponent = iconMap[partner.icon] || Building2;
            return (
              <div
                key={idx}
                className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200/90 hover:border-emerald-500/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-emerald-700 group-hover:scale-110 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-sm">
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                      {partner.badge}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-stone-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {partner.name}
                  </h3>
                  
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-3">
                    {partner.role}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {partner.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-stone-200/70 flex items-center justify-between text-[11px] text-stone-400 font-medium">
                  <span>Patto di Comunità</span>
                  <span className="font-bold text-stone-700">Savona #Giardinetti365</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
