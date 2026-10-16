import React from 'react';
import { Apartment, Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import {
  Users,
  Bed,
  Bath,
  Maximize2,
  Waves,
  Sun,
  MessageCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ApartmentCardProps {
  apartment: Apartment;
  currentLang: Language;
  settings: SiteSettings;
  onSelect: (apt: Apartment) => void;
  onRequestBooking: (apt: Apartment) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({
  apartment,
  currentLang,
  settings,
  onSelect,
  onRequestBooking
}) => {
  const t = translations[currentLang];
  const primaryImage = apartment.images?.[0] || '/src/assets/images/apartment_sea_view_1792176294057.jpg';

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const titleText = apartment.title[currentLang] || apartment.title.en;
  const descText = apartment.shortDescription?.[currentLang] || apartment.description[currentLang] || apartment.description.en;

  const whatsAppMessage = encodeURIComponent(
    currentLang === 'ar'
      ? `السلام عليكم، أود الاستفسار عن حجز: ${apartment.title.ar} بإقامة غروب شمس بريش. هل هي متاحة؟`
      : currentLang === 'fr'
      ? `Bonjour, je souhaite me renseigner pour réserver l'appartement: ${apartment.title.fr} à la Résidence Ghorob Chams Briech. Est-il disponible ?`
      : currentLang === 'es'
      ? `Hola, me gustaría consultar la disponibilidad para reservar: ${apartment.title.es || apartment.title.en} en la Residencia Ghorob Chams Briech.`
      : currentLang === 'de'
      ? `Guten Tag, ich möchte mich über die Verfügbarkeit von: ${apartment.title.de || apartment.title.en} in der Residenz Ghorob Chams Briech erkundigen.`
      : `Hello, I am interested in inquiring about booking: ${apartment.title.en} at Ghorob Chams Residence in Briech. Is it available?`
  );

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col h-full">
      {/* Image Container with Fallback */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={titleText}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Subtle scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges: Transparent Demo Notice & Sea View */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 pointer-events-none">
          {apartment.seaView ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-sky-900/90 text-white rounded-md backdrop-blur-xs shadow-xs">
              <Waves className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.seaViewLabel}</span>
            </span>
          ) : (
            <div />
          )}

          {apartment.isDemo && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-amber-500/90 text-slate-950 rounded-md backdrop-blur-xs shadow-xs"
              title={apartment.demoNotice?.[currentLang] || t.demoNoticeExplanation}
            >
              <AlertCircle className="w-3 h-3 text-slate-950" />
              <span>{t.demoNoticeBadge}</span>
            </span>
          )}
        </div>

        {/* Overlay Price Bottom */}
        <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold tracking-tight drop-shadow-sm font-sans tabular-nums">
              {apartment.pricePerNight}
            </span>
            <span className="text-xs font-medium text-slate-200">
              {apartment.currency} {t.priceNight}
            </span>
          </div>

          {apartment.balcony && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-200 font-medium drop-shadow-xs">
              <Sun className="w-3.5 h-3.5" />
              <span>{t.balconyLabel}</span>
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3
          onClick={() => onSelect(apartment)}
          className="text-lg font-bold text-slate-900 hover:text-sky-700 cursor-pointer transition-colors line-clamp-1 mb-1.5"
        >
          {titleText}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {descText}
        </p>

        {/* Metadata Strip: Clean unboxed metadata with separators (anti-slop rule) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 py-2.5 border-y border-slate-100 mb-4 tabular-nums">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {apartment.bedrooms} {t.bedroomsLabel}
            </span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {apartment.bathrooms} {t.bathroomsLabel}
            </span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {apartment.maxGuests} {t.guestsMax}
            </span>
          </div>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{apartment.areaM2} m²</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* View Details */}
          <button
            type="button"
            onClick={() => onSelect(apartment)}
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center whitespace-nowrap shrink-0"
          >
            {t.btnViewDetails}
          </button>

          {/* Request Booking */}
          <button
            type="button"
            onClick={() => onRequestBooking(apartment)}
            className="flex-1 py-2 px-3 text-xs sm:text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors text-center flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{t.btnRequestBooking}</span>
          </button>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center justify-center shrink-0"
            title={t.btnInquireWhatsApp}
            aria-label={t.btnInquireWhatsApp}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
};
