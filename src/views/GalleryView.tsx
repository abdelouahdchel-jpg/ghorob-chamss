import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { initialGalleryItems } from '../data/initialData';
import { X, ArrowLeft, ArrowRight, Maximize2, AlertCircle } from 'lucide-react';

interface GalleryViewProps {
  currentLang: Language;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];
  const [filter, setFilter] = useState<'all' | 'apartments' | 'balconies' | 'briech' | 'sunset'>('all');
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const filteredItems = initialGalleryItems.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'sunset') return item.category === 'sunset';
    if (filter === 'apartments') return item.category === 'apartments';
    if (filter === 'balconies') return item.category === 'balconies' || item.category === 'sunset';
    if (filter === 'briech') return item.category === 'briech';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
          {t.brandName} · Briech
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.galleryTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t.gallerySubtitle}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.galleryFilterAll}
        </button>
        <button
          type="button"
          onClick={() => setFilter('apartments')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            filter === 'apartments' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.galleryFilterApartments}
        </button>
        <button
          type="button"
          onClick={() => setFilter('balconies')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            filter === 'balconies' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.galleryFilterBalconies}
        </button>
        <button
          type="button"
          onClick={() => setFilter('briech')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
            filter === 'briech' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.galleryFilterBriech}
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const caption = item.title[currentLang] || item.title.en;
          return (
            <div
              key={item.id}
              onClick={() => setActiveModalIndex(index)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={item.src}
                  alt={caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Scrim with caption and maximize icon */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <p className="text-xs sm:text-sm font-medium leading-snug line-clamp-2">
                  {caption}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="capitalize">{item.category}</span>
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activeModalIndex !== null && filteredItems[activeModalIndex] && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <button
            onClick={() => setActiveModalIndex(null)}
            className="absolute top-5 right-5 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous / Next buttons */}
          {filteredItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveModalIndex(
                    (activeModalIndex - 1 + filteredItems.length) % filteredItems.length
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white rounded-full bg-slate-900/60 hover:bg-slate-900/90 transition-colors z-20"
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActiveModalIndex((activeModalIndex + 1) % filteredItems.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white rounded-full bg-slate-900/60 hover:bg-slate-900/90 transition-colors z-20"
                aria-label="Next photo"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Modal Content */}
          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center">
            <img
              src={filteredItems[activeModalIndex].src}
              alt="Fullscreen preview"
              className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <p className="text-white text-xs sm:text-sm text-center mt-4 max-w-xl font-medium">
              {filteredItems[activeModalIndex].title[currentLang] ||
                filteredItems[activeModalIndex].title.en}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
