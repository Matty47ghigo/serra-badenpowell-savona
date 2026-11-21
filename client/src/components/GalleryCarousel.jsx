import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Sparkles, Filter, Play, Pause } from 'lucide-react';
import { GREENHOUSE_DATA } from '../data/greenhouseData';

export default function GalleryCarousel() {
  const images = GREENHOUSE_DATA.gallery;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('tutte');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Autoplay carousel
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying, images.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const filteredImages = selectedCategory === 'tutte'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-stone-900 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Esperienza Visiva</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Scorci & Meraviglie della Serra
          </h2>
          <p className="text-stone-300 text-base sm:text-lg">
            Lasciati conquistare dalla geometria ipnotica delle cactacee, dai giochi di luce 
            delle vetrate storiche e dall'energia autentica della nostra comunità.
          </p>
        </div>

        {/* --- CAROSELLO PRINCIPALE IN EVIDENZA --- */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black border border-stone-800 mb-16 aspect-video max-h-[560px] group">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

              {/* Slide Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider mb-2">
                    {img.tag}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight mb-2">
                    {img.title}
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm max-w-xl">
                    {img.description}
                  </p>
                </div>

                <button
                  onClick={() => setLightboxImage(img)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold self-start sm:self-auto border border-white/20"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Espandi</span>
                </button>
              </div>
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110"
            aria-label="Slide precedente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-all hover:scale-110"
            aria-label="Slide successiva"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Autoplay & Indicators Bar */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/80 hover:text-white border border-white/20"
              title={isPlaying ? "Metti in pausa autoplay" : "Avvia autoplay"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Vai alla slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* --- GRIGLIA FOTOGRAFICA CON FILTRI --- */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Esplora la Galleria Fotografica
              </h3>
              <p className="text-stone-400 text-xs sm:text-sm">
                Filtra gli scatti per scoprire da vicino le diverse sfaccettature della serra
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'tutte', label: 'Tutte le Foto' },
                { id: 'botanica', label: 'Botanica & Cacti' },
                { id: 'serra', label: 'La Serra' },
                { id: 'sociale', label: 'Progetto Sociale' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === filter.id
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setLightboxImage(img)}
                className="group relative rounded-2xl overflow-hidden bg-stone-800 border border-stone-800 cursor-pointer aspect-4/3 shadow-md hover:shadow-emerald-950/40 hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                    {img.tag}
                  </span>
                  <h4 className="font-serif font-bold text-white text-base leading-snug">
                    {img.title}
                  </h4>
                  <p className="text-stone-300 text-xs line-clamp-2 mt-1">
                    {img.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 animate-fadeIn">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full text-center">
            <img
              src={lightboxImage.url}
              alt={lightboxImage.title}
              className="max-h-[75vh] mx-auto rounded-2xl shadow-2xl object-contain border border-stone-800"
            />
            <div className="mt-4 text-white">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {lightboxImage.tag}
              </span>
              <h4 className="font-serif text-2xl font-bold mt-1">
                {lightboxImage.title}
              </h4>
              <p className="text-stone-400 text-sm max-w-xl mx-auto mt-1">
                {lightboxImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
