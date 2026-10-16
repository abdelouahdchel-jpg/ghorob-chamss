import React, { useState } from 'react';
import { Apartment, Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { ApartmentCard } from '../components/ApartmentCard';
import { Filter, AlertCircle, Waves, Check } from 'lucide-react';

interface ApartmentsViewProps {
  currentLang: Language;
  settings: SiteSettings;
  apartments: Apartment[];
  onSelectApartment: (apt: Apartment) => void;
  onRequestBooking: (apt: Apartment) => void;
}

export const ApartmentsView: React.FC<ApartmentsViewProps> = ({
  currentLang,
  settings,
  apartments,
  onSelectApartment,
  onRequestBooking
}) => {
  const t = translations[currentLang];

  const [filterSeaViewOnly, setFilterSeaViewOnly] = useState(false);
  const [filterBedrooms, setFilterBedrooms] = useState<number | 'all'>('all');
  const [filterGuests, setFilterGuests] = useState<number | 'all'>('all');

  const filteredApartments = apartments.filter(apt => {
    if (filterSeaViewOnly && !apt.seaView) return false;
    if (filterBedrooms !== 'all' && apt.bedrooms !== filterBedrooms) return false;
    if (filterGuests !== 'all' && apt.maxGuests < filterGuests) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Intro */}
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
          {t.brandName} · Briech
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.featuredTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t.featuredSubtitle}
        </p>
      </div>

      {/* Demo Notice Banner (anti-misrepresentation compliance) */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <p className="font-bold mb-0.5">{t.demoNoticeBadge}</p>
          <p className="text-amber-800 leading-relaxed">
            {t.demoNoticeExplanation}
          </p>
        </div>
      </div>

      {/* Filter Controls (interactive segmented buttons) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sea View Toggle */}
          <button
            type="button"
            onClick={() => setFilterSeaViewOnly(!filterSeaViewOnly)}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
              filterSeaViewOnly
                ? 'bg-sky-800 text-white border-sky-800 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Waves className="w-4 h-4" />
            <span>{t.filterSeaView}</span>
            {filterSeaViewOnly && <Check className="w-3.5 h-3.5" />}
          </button>

          {/* Bedrooms Selector */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-500 font-medium">{t.filterBedrooms}:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setFilterBedrooms('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  filterBedrooms === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterAnyBedrooms}
              </button>
              {[1, 2, 3].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFilterBedrooms(num)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium tabular-nums ${
                    filterBedrooms === num
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Guests Selector */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className="text-slate-500 font-medium">{t.filterGuests}:</span>
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setFilterGuests('all')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                  filterGuests === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.filterAnyGuests}
              </button>
              {[2, 4, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFilterGuests(num)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium tabular-nums ${
                    filterGuests === num
                      ? 'bg-white text-slate-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {num}+
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Count Indicator */}
        <span className="text-xs text-slate-500 font-medium tabular-nums">
          {filteredApartments.length}{' '}
          {currentLang === 'ar'
            ? 'شقق معروضة'
            : currentLang === 'fr'
            ? 'logements'
            : currentLang === 'es'
            ? 'apartamentos'
            : currentLang === 'de'
            ? 'Unterkünfte'
            : 'apartments'}
        </span>
      </div>

      {/* Grid of Listings */}
      {filteredApartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredApartments.map(apt => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              currentLang={currentLang}
              settings={settings}
              onSelect={onSelectApartment}
              onRequestBooking={onRequestBooking}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-800">
            {currentLang === 'ar'
              ? 'لم يتم العثور على شقق تطابق خيارات التصفية الحالية.'
              : currentLang === 'fr'
              ? 'Aucun logement ne correspond aux critères sélectionnés.'
              : currentLang === 'es'
              ? 'No se han encontrado apartamentos con los filtros seleccionados.'
              : currentLang === 'de'
              ? 'Keine Unterkünfte für diese Filterkriterien gefunden.'
              : 'No apartments found matching these filters.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setFilterSeaViewOnly(false);
              setFilterBedrooms('all');
              setFilterGuests('all');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
          >
            {currentLang === 'ar'
              ? 'إعادة ضبط التصفية'
              : currentLang === 'fr'
              ? 'Réinitialiser les filtres'
              : currentLang === 'es'
              ? 'Restablecer filtros'
              : currentLang === 'de'
              ? 'Filter zurücksetzen'
              : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  );
};
