import React, { useState } from 'react';
import { Flower2, Sparkles, Droplets, SunMedium, Globe, Search, Info, X } from 'lucide-react';
import { PLANTS_DATA, PLANT_FAMILIES } from '../data/plantsData';

export default function BotanicalHeritage() {
  const [selectedFamily, setSelectedFamily] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);

  const filteredPlants = PLANTS_DATA.filter((plant) => {
    const matchesFamily = selectedFamily === 'all' || plant.family === selectedFamily;
    const matchesSearch =
      plant.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.origin.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFamily && matchesSearch;
  });

  return (
    <section id="botanical" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Flower2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Patrimonio & Catalogo Botanico</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight mb-4">
            Le Piante della Collezione Caroggio
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Oltre 700 esemplari catalogati scientificamente. Scopri le specie più rappresentative 
            e le loro peculiarità morfologiche ed evolutive.
          </p>
        </div>

        {/* Search & Family Filter Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-10 bg-stone-50 p-3 sm:p-4 rounded-3xl border border-stone-200">
          
          {/* Family Tabs - Scrollabile touch su mobile */}
          <div className="flex overflow-x-auto pb-1 sm:pb-0 gap-2 w-full md:w-auto shrink-0 no-scrollbar">
            {PLANT_FAMILIES.map((fam) => (
              <button
                key={fam.id}
                onClick={() => setSelectedFamily(fam.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 whitespace-nowrap shrink-0 ${
                  selectedFamily === fam.id
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white text-stone-700 hover:bg-stone-200/80 border border-stone-200'
                }`}
              >
                {fam.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cerca specie, nome o origine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>
        </div>

        {/* Plants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredPlants.map((plant) => (
            <div
              key={plant.id}
              onClick={() => setSelectedPlant(plant)}
              className="group bg-stone-50 rounded-3xl overflow-hidden border border-stone-200 hover:border-emerald-500/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Image Container with Badge */}
                <div className="relative aspect-4/3 overflow-hidden bg-stone-200">
                  <img
                    src={plant.image}
                    alt={plant.scientificName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold tracking-wide border border-white/10 uppercase">
                      {plant.badge}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-emerald-800">{plant.family}</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-stone-400" />
                      {plant.origin}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight group-hover:text-emerald-700 transition-colors">
                      {plant.commonName}
                    </h3>
                    <div className="font-serif italic text-xs text-stone-500 mt-0.5">
                      {plant.scientificName}
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {plant.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0">
                <button className="w-full py-2 rounded-xl bg-white group-hover:bg-emerald-700 text-stone-700 group-hover:text-white border border-stone-200 group-hover:border-emerald-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                  <Info className="w-3.5 h-3.5" />
                  <span>Dettagli Scheda</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPlants.length === 0 && (
          <div className="text-center py-16 text-stone-500">
            <p className="text-sm">Nessuna specie botanica trovata con i filtri selezionati.</p>
          </div>
        )}

      </div>

      {/* --- MODAL SCHEDA BOTANICA APPROFONDITA (Mobile & Tablet Responsive) --- */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setSelectedPlant(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
              aria-label="Chiudi scheda botanica"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-44 sm:h-56 md:h-64 relative overflow-hidden bg-stone-900 shrink-0">
              <img
                src={selectedPlant.image}
                alt={selectedPlant.scientificName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/30 to-transparent flex items-end p-4 sm:p-6">
                <div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {selectedPlant.family} • {selectedPlant.origin}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white mt-0.5 leading-tight">
                    {selectedPlant.commonName}
                  </h3>
                  <div className="font-serif italic text-stone-300 text-xs sm:text-sm">
                    {selectedPlant.scientificName}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
                  Descrizione Morfologica
                </h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {selectedPlant.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2.5">
                  <span className="text-amber-600 text-lg">💡</span>
                  <div>
                    <h5 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
                      Curiosità della Serra
                    </h5>
                    <p className="text-xs text-amber-900 leading-relaxed mt-0.5">
                      {selectedPlant.curiosity}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                    <SunMedium className="w-4 h-4 text-amber-600" />
                    <span>Fioritura in Serra</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{selectedPlant.flowering}</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2 font-bold text-stone-900 mb-1">
                    <Droplets className="w-4 h-4 text-emerald-600" />
                    <span>Fabbisogno Idrico</span>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{selectedPlant.waterNeeds}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
              <a
                href="#booking"
                onClick={() => setSelectedPlant(null)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors"
              >
                <span>Prenota Visita per Ammirarla dal Vivo</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
