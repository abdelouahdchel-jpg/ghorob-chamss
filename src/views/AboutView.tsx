import React from 'react';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { Compass, Waves, Sun, Sparkles, MapPin, Heart } from 'lucide-react';

interface AboutViewProps {
  currentLang: Language;
  settings: SiteSettings;
  onNavigate: (page: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ currentLang, onNavigate }) => {
  const t = translations[currentLang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block">
          {t.brandName} · Briech, Morocco
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {t.aboutStoryTitle}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {t.tagline}
        </p>
      </div>

      {/* Main Narrative Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          <p>{t.aboutP1}</p>
          <p>{t.aboutP2}</p>
          <p>{t.aboutP3}</p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('apartments')}
              className="px-6 py-3 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {t.btnExplore}
            </button>
            <button
              onClick={() => onNavigate('location')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-sky-700" />
              <span>{t.navLocation}</span>
            </button>
          </div>
        </div>

        <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
          <img
            src="/src/assets/images/residence_exterior_sunset_1792176295267.jpg"
            alt="Ghorob Chams Residence building exterior at sunset"
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 end-4 p-1 rounded-full bg-white/90 backdrop-blur-md shadow-lg ring-2 ring-amber-400/50">
            <img
              src="/src/assets/images/ghorob_chams_logo_1792178775871.jpg"
              alt="إقامة غروب شمس"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 3 Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Sun className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {currentLang === 'ar'
              ? 'غروب الشمس وسكون البحر'
              : currentLang === 'fr'
              ? 'Couchers de Soleil & Océan'
              : currentLang === 'es'
              ? 'Atardeceres y Sosiego Marino'
              : currentLang === 'de'
              ? 'Sonnenuntergang & Meeresstille'
              : 'Sunset Serenity'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentLang === 'ar'
              ? 'موقع الشرفات موجه غرباً نحو الأفق الأطلسي، للاستمتاع بلحظات الغروب الذهبية كل مساء في هدوء تام.'
              : currentLang === 'fr'
              ? 'Des balcons orientés plein ouest vers l’océan pour savourer la lumière dorée de chaque fin de journée en toute quiétude.'
              : currentLang === 'es'
              ? 'Balcones orientados al oeste hacia el horizonte atlántico para disfrutar del brillo dorado del atardecer en completa calma.'
              : currentLang === 'de'
              ? 'Westbalkone mit freiem Blick auf den Atlantik, um die goldenen Abendstunden in absoluter Ruhe zu genießen.'
              : 'West-facing balconies positioned toward the Atlantic horizon, letting you savor serene golden sunsets every evening.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {currentLang === 'ar'
              ? 'القرب من أصيلة وطنجة'
              : currentLang === 'fr'
              ? 'Entre Assilah et Tanger'
              : currentLang === 'es'
              ? 'Entre Arcila y Tánger'
              : currentLang === 'de'
              ? 'Zwischen Asilah und Tanger'
              : 'Between Asilah & Tangier'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentLang === 'ar'
              ? '10 دقائق فقط تفصلك عن مدينة أصيلة التاريخية، و30 دقيقة عن طنجة، مما يجمع بين الراحة وسهولة التنقل.'
              : currentLang === 'fr'
              ? 'À 10 minutes à peine de la médina blanche d’Assilah et 30 minutes de Tanger, combinant quiétude et mobilité.'
              : currentLang === 'es'
              ? 'A tan solo 10 minutos de la artística medina blanca de Arcila y a 30 minutos de Tánger, combinando descanso y movilidad.'
              : currentLang === 'de'
              ? 'Nur 10 Minuten von der weißen Medina von Asilah und 30 Minuten von Tanger entfernt, perfekte Kombination aus Erholung und Mobilität.'
              : 'Just 10 minutes from Asilah’s artistic whitewashed medina and 30 minutes from Tangier, balancing calm and convenience.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {currentLang === 'ar'
              ? 'ضيافة عائلية واهتمام مباشر'
              : currentLang === 'fr'
              ? 'Hospitalité & Respect'
              : currentLang === 'es'
              ? 'Hospitalidad Familiar y Trato Directo'
              : currentLang === 'de'
              ? 'Familiäre Gastfreundschaft & Direkter Kontakt'
              : 'Direct Host Care'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {currentLang === 'ar'
              ? 'نحرص على توفير بيئة عائلية آمنة ومريحة، مع تواصل شفاف وسريع لتلبية احتياجات ضيوفنا.'
              : currentLang === 'fr'
              ? 'Un cadre familial paisible, des appartements propres et un contact direct et attentionné.'
              : currentLang === 'es'
              ? 'Cuidamos un ambiente familiar seguro y apacible, con comunicación transparente y rápida para cualquier necesidad.'
              : currentLang === 'de'
              ? 'Wir legen Wert auf eine sichere und ruhige Familienatmosphäre mit ehrlicher, schneller Betreuung.'
              : 'A secure, clean family atmosphere with transparent direct owner communication and responsive assistance.'}
          </p>
        </div>
      </div>
    </div>
  );
};
