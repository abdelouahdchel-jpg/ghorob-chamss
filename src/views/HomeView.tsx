import React from 'react';
import { Apartment, Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { ApartmentCard } from '../components/ApartmentCard';
import {
  Compass,
  Waves,
  Sun,
  ShieldCheck,
  MapPin,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HomeViewProps {
  currentLang: Language;
  settings: SiteSettings;
  apartments: Apartment[];
  onNavigate: (page: string, param?: string) => void;
  onOpenBooking: (apartment?: Apartment) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  currentLang,
  settings,
  apartments,
  onNavigate,
  onOpenBooking
}) => {
  const t = translations[currentLang];
  const isRTL = currentLang === 'ar';
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const whatsAppHeroMsg = encodeURIComponent(
    currentLang === 'ar'
      ? 'السلام عليكم، أود حجز شقة عطلات في إقامة غروب شمس ببريش.'
      : currentLang === 'fr'
      ? 'Bonjour, je souhaite réserver un séjour à la Résidence Ghorob Chams à Briech.'
      : currentLang === 'es'
      ? 'Hola, deseo reservar una estancia vacacional en la Residencia Ghorob Chams en Briech.'
      : currentLang === 'de'
      ? 'Guten Tag, ich möchte einen Urlaub in der Residenz Ghorob Chams in Briech buchen.'
      : 'Hello, I would like to reserve a coastal stay at Ghorob Chams Residence in Briech.'
  );

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[660px] flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Background Image with High-Fidelity Asset */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_sunset_coastal_1792176292926.jpg"
            alt="Sunset over Ghorob Chams Residence and Atlantic Coast in Briech"
            className="w-full h-full object-cover object-center transform scale-102 transition-transform duration-1000"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Measured Scrim for WCAG AA readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white space-y-6">
          {/* Official Round Logo Badge */}
          <div className="flex justify-center mb-1">
            <div className="relative p-1 rounded-full bg-white/20 backdrop-blur-md shadow-2xl ring-4 ring-amber-400/40 hover:scale-105 transition-transform duration-300">
              <img
                src="/src/assets/images/ghorob_chams_logo_1792178775871.jpg"
                alt="إقامة غروب شمس | Ghorob Chams Residence"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover shadow-inner"
              />
            </div>
          </div>

          {/* Arabic & English Subtitle kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="font-arabic font-semibold">إقامة غروب شمس · بريش</span>
            <span className="text-white/60">|</span>
            <span>Briech · Asilah Coast</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-tight max-w-4xl mx-auto drop-shadow-md">
            {t.heroHeadline}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed drop-shadow-xs">
            {t.heroSubtitle}
          </p>

          {/* 3 Call to Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {/* Button 1: Explore Apartments */}
            <button
              onClick={() => onNavigate('apartments')}
              className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <span>{t.btnExplore}</span>
              {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Button 2: Book Your Stay */}
            <button
              onClick={() => onOpenBooking()}
              className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t.btnBookStay}</span>
            </button>

            {/* Button 3: WhatsApp Direct Contact */}
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppHeroMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Location micro-proof */}
          <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Briech, Morocco · 10 km north of Asilah · Route Côtière N1</span>
          </div>
        </div>
      </section>

      {/* 2. Location Highlights & Distance Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Asilah Medina</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">{t.distanceAsilah}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Waves className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Atlantic Coast</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">{t.distanceBeach}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center shrink-0">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Tangier Airport (TNG)</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">{t.distanceAirport}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Port Tanger Med</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">{t.distanceTangierMed}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Apartments Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
              Holiday Rentals · Briech
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.featuredTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
              {t.featuredSubtitle}
            </p>
          </div>
          <button
            onClick={() => onNavigate('apartments')}
            className="inline-flex items-center gap-2 text-sm font-bold text-sky-800 hover:text-sky-950 transition-colors shrink-0"
          >
            <span>{t.btnExplore}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Apartments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apartments.slice(0, 3).map(apt => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              currentLang={currentLang}
              settings={settings}
              onSelect={selected => onNavigate('apartment-detail', selected.id)}
              onRequestBooking={selected => onOpenBooking(selected)}
            />
          ))}
        </div>
      </section>

      {/* 4. Why Choose Ghorob Chams Residence (Editorial Bento & Value Proof) */}
      <section className="bg-gradient-to-b from-stone-100 to-white py-16 sm:py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-1">
              Authentic Moroccan Hospitality
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {t.whyTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              {t.whySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Reason 1 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-5">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.whyReason1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.whyReason1Desc}
              </p>
            </div>

            {/* Reason 2 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.whyReason2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.whyReason2Desc}
              </p>
            </div>

            {/* Reason 3 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center mb-5">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.whyReason3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.whyReason3Desc}
              </p>
            </div>

            {/* Reason 4 */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t.whyReason4Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.whyReason4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Coastal Scenery & Briech Atmosphere Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Briech & Asilah Coastline
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {currentLang === 'ar'
                ? 'سكون الطبيعة الأطلسية وغروب الشمس الأخاذ'
                : currentLang === 'fr'
                ? 'La Sérénité de la Côte Atlantique et ses Couchers de Soleil'
                : currentLang === 'es'
                ? 'La Serenidad de la Costa Atlántica y sus Atardeceres'
                : currentLang === 'de'
                ? 'Atlantische Ruhe und spektakuläre Sonnenuntergänge'
                : 'Atlantic Tranquility & Breathtaking Sunset Panoramas'}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {currentLang === 'ar'
                ? 'تعتبر بريش واحدة من أجمل البقاع الساحلية الهادئة في شمال المغرب. شواطئ رملية ممتدة، هواء عليل، وموقع استراتيجي يسمح بزيارة أصيلة وطنجة دون التنازل عن الراحة والهدوء التام.'
                : currentLang === 'fr'
                ? 'Briech est l’une des perles secrètes du littoral nord marocain. De longues étendues de sable fin, un air vivifiant et un emplacement privilégié pour visiter Assilah et Tanger tout en profitant du calme absolu.'
                : currentLang === 'es'
                ? 'Briech es una de las joyas secretas de la costa norte de Marruecos. Extensas playas de arena fina, brisa pura y una ubicación privilegiada para visitar Arcila y Tánger disfrutando de la máxima tranquilidad.'
                : currentLang === 'de'
                ? 'Briech ist eines der unentdeckten Juwelen der nordmarokkanischen Küste. Weite Sandstrände, erfrischende Meeresbrise und eine ideale Lage, um Asilah und Tanger zu erkunden und abends vollkommene Ruhe zu genießen.'
                : 'Briech offers one of northern Morocco’s most tranquil seaside settings. Vast unspoiled sandy beaches, refreshing ocean air, and the perfect base to explore Asilah and Tangier while retreating to pure serenity.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('gallery')}
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold rounded-xl text-sm transition-colors"
              >
                {t.navGallery}
              </button>
              <button
                onClick={() => onNavigate('location')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>{t.navLocation}</span>
              </button>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-full">
            <img
              src="/src/assets/images/briech_beach_coast_1792176294889.jpg"
              alt="Briech beach coast at sunset near Asilah"
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* 6. Interactive Location & Google Map Embed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
            {t.locationTitle}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {currentLang === 'ar'
              ? 'موقع إقامة غروب شمس ببريش'
              : currentLang === 'fr'
              ? 'Localisation de la Résidence à Briech'
              : 'Our Location in Briech'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {settings.address[currentLang] || settings.address.en}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="aspect-16/9 sm:aspect-21/9 w-full bg-slate-100 relative">
            <iframe
              title="Ghorob Chams Residence Briech Google Maps"
              src={settings.googleMapsEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="p-4 sm:p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-sky-700 shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                Briech · 10 km North of Asilah · 35 min from Tangier
              </span>
            </div>
            <a
              href={settings.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg border border-slate-300 transition-colors flex items-center gap-2 shrink-0"
            >
              <span>{t.openGoogleMaps}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. Direct WhatsApp Reservation Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-sky-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-start max-w-xl">
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold backdrop-blur-xs">
              WhatsApp Fast Reservation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {currentLang === 'ar'
                ? 'تواصل مباشرة مع المالك لتأكيد حجزك'
                : currentLang === 'fr'
                ? 'Contactez directement le propriétaire pour réserver'
                : currentLang === 'es'
                ? 'Contacte directamente con el propietario para reservar'
                : currentLang === 'de'
                ? 'Kontaktieren Sie den Vermieter direkt zur Reservierung'
                : 'Connect directly with the owner for reservations'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {currentLang === 'ar'
                ? 'احصل على رد سريع ومباشر حول التوفر والأسعار حسب التواريخ المختارة.'
                : currentLang === 'fr'
                ? 'Obtenez une réponse rapide sur les disponibilités et les tarifs selon vos dates de vacances.'
                : currentLang === 'es'
                ? 'Obtenga una respuesta ágil sobre disponibilidad y tarifas según sus fechas de viaje.'
                : currentLang === 'de'
                ? 'Erhalten Sie schnelle Auskunft über Verfügbarkeit und Saisonpreise für Ihre Reisedaten.'
                : 'Fast personal assistance on availability, seasonal prices, and arrival details.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppHeroMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <span>{t.chatNowWhatsApp}</span>
            </a>
            <button
              onClick={() => onOpenBooking()}
              className="px-6 py-3.5 bg-emerald-950/40 hover:bg-emerald-950/60 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors text-center"
            >
              {t.btnRequestBooking}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
