import React, { useState } from 'react';
import { Apartment, Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import {
  Bed,
  Bath,
  Users,
  Maximize2,
  Waves,
  Sun,
  Wifi,
  Utensils,
  Wind,
  Car,
  Tv,
  Sparkles,
  MessageCircle,
  Calendar,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock
} from 'lucide-react';

interface ApartmentDetailViewProps {
  apartment: Apartment;
  currentLang: Language;
  settings: SiteSettings;
  onBack: () => void;
  onRequestBooking: (apt: Apartment) => void;
}

export const ApartmentDetailView: React.FC<ApartmentDetailViewProps> = ({
  apartment,
  currentLang,
  settings,
  onBack,
  onRequestBooking
}) => {
  const t = translations[currentLang];
  const isRTL = currentLang === 'ar';
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [checkInDate, setCheckInDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  const images = apartment.images?.length > 0 ? apartment.images : ['/src/assets/images/apartment_sea_view_1792176294057.jpg'];
  const titleText = apartment.title[currentLang] || apartment.title.en;
  const descText = apartment.description[currentLang] || apartment.description.en;

  // Nights calculation
  let nights = 0;
  if (checkInDate && checkOutDate) {
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    nights = Math.max(0, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
  }
  const estimatedStayCost = nights * apartment.pricePerNight;

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsAppPrefilledMsg = encodeURIComponent(
    currentLang === 'ar'
      ? `السلام عليكم، أود الاستفسار عن حجز: ${apartment.title.ar} بإقامة غروب شمس بريش.\nالتواريخ المقترحة: من ${checkInDate} إلى ${checkOutDate} (${nights} ليالٍ).\nهل هي متاحة؟`
      : currentLang === 'fr'
      ? `Bonjour, je souhaite me renseigner pour réserver l'appartement: ${apartment.title.fr} à la Résidence Ghorob Chams Briech.\nDates souhaitées: du ${checkInDate} au ${checkOutDate} (${nights} nuits).\nEst-il disponible ?`
      : currentLang === 'es'
      ? `Hola, me gustaría solicitar reserva para: ${apartment.title.es || apartment.title.en} en la Residencia Ghorob Chams Briech.\nFechas solicitadas: del ${checkInDate} al ${checkOutDate} (${nights} noches).\n¿Está disponible?`
      : currentLang === 'de'
      ? `Guten Tag, ich möchte mich über eine Buchung für: ${apartment.title.de || apartment.title.en} in der Residenz Ghorob Chams Briech erkundigen.\nGewünschter Zeitraum: vom ${checkInDate} bis ${checkOutDate} (${nights} Nächte).\nIst die Wohnung verfügbar?`
      : `Hello, I would like to inquire about booking: ${apartment.title.en} at Ghorob Chams Residence in Briech.\nProposed dates: from ${checkInDate} to ${checkOutDate} (${nights} nights).\nIs it available?`
  );

  const amenityIcons: Record<string, { label: string; icon: any }> = {
    seaView: { label: t.seaViewLabel, icon: Waves },
    balcony: { label: t.balconyLabel, icon: Sun },
    wifi: { label: 'High-speed WiFi', icon: Wifi },
    equippedKitchen: { label: 'Equipped Kitchen', icon: Utensils },
    airConditioning: { label: 'Air Conditioning', icon: Wind },
    freeParking: { label: 'Private Parking', icon: Car },
    smartTv: { label: 'Smart TV', icon: Tv },
    washingMachine: { label: 'Washing Machine', icon: Sparkles },
    familyFriendly: { label: 'Family Friendly', icon: Users }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        <span>{t.navApartments}</span>
      </button>

      {/* Demo Notice Banner */}
      {apartment.isDemo && (
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3.5 text-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <span className="font-bold block">{t.demoNoticeBadge}</span>
            <span>{apartment.demoNotice?.[currentLang] || t.demoNoticeExplanation}</span>
          </div>
        </div>
      )}

      {/* Main Title & Key Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
            Ghorob Chams Residence · Briech
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {titleText}
          </h1>
          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600 mt-2.5 tabular-nums">
            <span>{apartment.bedrooms} {t.bedroomsLabel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{apartment.bathrooms} {t.bathroomsLabel}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{apartment.maxGuests} {t.guestsMax}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{apartment.areaM2} m²</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{t.floorLabel} {apartment.floor}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-sky-800 font-semibold">{t.furnishedStatus}</span>
          </div>
        </div>

        {/* Nightly & Monthly Price Display */}
        <div className="text-start md:text-end">
          <div className="flex items-baseline md:justify-end gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              {apartment.pricePerNight}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {apartment.currency} {t.priceNight}
            </span>
          </div>
          {apartment.pricePerMonth && (
            <p className="text-xs text-slate-500 mt-0.5">
              {t.fromPrice} {apartment.pricePerMonth} {apartment.currency} {t.priceMonth}
            </p>
          )}
        </div>
      </div>

      {/* Photo Gallery with Hero Frame & Thumbnails */}
      <div className="space-y-3">
        {/* Main Display Image */}
        <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
          <img
            src={images[activeImageIndex]}
            alt={`${titleText} view ${activeImageIndex + 1}`}
            className="w-full h-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length)}
                className="w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center pointer-events-auto backdrop-blur-xs transition-colors"
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((activeImageIndex + 1) % images.length)}
                className="w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white flex items-center justify-center pointer-events-auto backdrop-blur-xs transition-colors"
                aria-label="Next photo"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Index Counter */}
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-slate-950/70 text-white text-xs font-medium rounded-md backdrop-blur-xs">
            {activeImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails Strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-sky-600 ring-2 ring-sky-300' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2-Column Content Layout: Left Details, Right Booking / Price Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (2 spans): Description, Features, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Prose */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">
              {currentLang === 'ar' ? 'وصف الشقة والموقع' : currentLang === 'fr' ? 'Description du Logement' : 'Apartment Overview'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {descText}
            </p>

            {/* Key Features Bulleted */}
            {apartment.features?.[currentLang] && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  {currentLang === 'ar' ? 'المزايا البارزة' : currentLang === 'fr' ? 'Points Forts' : 'Key Highlights'}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {apartment.features[currentLang].map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-6">
              {currentLang === 'ar' ? 'التجهيزات والخدمات المتوفرة' : currentLang === 'fr' ? 'Équipements & Confort' : 'Amenities & Facilities'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {apartment.amenities.map(key => {
                const info = amenityIcons[key] || { label: key, icon: Check };
                const IconComp = info.icon;
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm font-medium text-slate-800"
                  >
                    <IconComp className="w-4 h-4 text-sky-700 shrink-0" />
                    <span>{info.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrival & House Rules */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              {currentLang === 'ar' ? 'أوقات الدخول والمغادرة' : currentLang === 'fr' ? 'Arrivée & Départ' : 'Check-in & Stay Policies'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <span className="font-semibold block">{t.checkInLabel}</span>
                  <span className="text-slate-500">From {settings.checkInTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <Clock className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <span className="font-semibold block">{t.checkOutLabel}</span>
                  <span className="text-slate-500">Until {settings.checkOutTime}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {currentLang === 'ar'
                ? 'إقامة عائلية هادئة تحترم راحة الجيران والهدوء الليلي. يرجى التنسيق المسبق مع المالك لوصول سلس.'
                : currentLang === 'fr'
                ? 'Résidence familiale calme respectant le repos des résidents. Merci de coordonner votre heure d’arrivée à l’avance.'
                : 'Quiet family-oriented residential property. Please coordinate your approximate arrival time in advance with the owner.'}
            </p>
          </div>
        </div>

        {/* Right Column (1 span): Interactive Stay Calculator & Booking Actions */}
        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
              Holiday Rental
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                {apartment.pricePerNight}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {apartment.currency} {t.priceNight}
              </span>
            </div>
          </div>

          {/* Date Picker Form for Cost Preview */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.checkInLabel}
              </label>
              <input
                type="date"
                value={checkInDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setCheckInDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.checkOutLabel}
              </label>
              <input
                type="date"
                value={checkOutDate}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                onChange={e => setCheckOutDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600"
              />
            </div>
          </div>

          {/* Stay Calculation Breakdown */}
          {nights > 0 ? (
            <div className="bg-sky-50/80 rounded-xl p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{nights} {nights === 1 ? t.night : t.nights} × {apartment.pricePerNight} {apartment.currency}</span>
                <span className="font-semibold tabular-nums">{estimatedStayCost} {apartment.currency}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 pt-1.5 border-t border-sky-100 text-sm">
                <span>{t.estimatedTotal}</span>
                <span className="text-sky-900 tabular-nums">{estimatedStayCost} {apartment.currency}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                {t.pricingNote}
              </p>
            </div>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg">
              {currentLang === 'ar' ? 'يرجى تحديد تواريخ صالحة لحساب التكلفة.' : 'Please select valid check-in and check-out dates.'}
            </p>
          )}

          {/* Action 1: Open Full Booking Inquiry Modal */}
          <button
            type="button"
            onClick={() => onRequestBooking(apartment)}
            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>{t.btnRequestBooking}</span>
          </button>

          {/* Action 2: Direct WhatsApp with pre-filled message */}
          <a
            href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppPrefilledMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t.btnInquireWhatsApp}</span>
          </a>

          {/* Safe & Direct Contact */}
          <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.transparentNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
