import React from 'react';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import {
  MapPin,
  Car,
  Train,
  Plane,
  Compass,
  ExternalLink,
  Waves,
  Navigation
} from 'lucide-react';

interface LocationViewProps {
  currentLang: Language;
  settings: SiteSettings;
}

export const LocationView: React.FC<LocationViewProps> = ({ currentLang, settings }) => {
  const t = translations[currentLang];

  const nearbyPOIs = [
    {
      name:
        currentLang === 'ar'
          ? 'مدينة أصيلة العتيقة والجداريات'
          : currentLang === 'fr'
          ? 'Médina d’Assilah & Remparts'
          : currentLang === 'es'
          ? 'Medina y Murallas de Arcila'
          : currentLang === 'de'
          ? 'Medina & Wehrmauern von Asilah'
          : 'Asilah Old Medina & Murals',
      distance: '10 km (10 min)',
      desc:
        currentLang === 'ar'
          ? 'أزقة بيضاء وزرقاء، أسوار تاريخية، معارض فنية ومطاعم سمك طازجة.'
          : currentLang === 'fr'
          ? 'Ruelles blanches et bleues, remparts face à l’océan et cuisine de la mer.'
          : currentLang === 'es'
          ? 'Callejuelas blancas, murallas oceánicas, murales de arte y marisquerías tradicionales.'
          : currentLang === 'de'
          ? 'Weiße Gassen, Wehrmauern am Meer, berühmte Wandmalereien und traditionelle Fischrestaurants.'
          : 'Whitewashed alleys, historic ocean ramparts, art murals, and fresh fish restaurants.'
    },
    {
      name:
        currentLang === 'ar'
          ? 'شاطئ وكثبان بريش'
          : currentLang === 'fr'
          ? 'Plage de Briech'
          : currentLang === 'es'
          ? 'Playa y Dunas de Briech'
          : currentLang === 'de'
          ? 'Strand & Dünen von Briech'
          : 'Briech Atlantic Beach',
      distance:
        currentLang === 'ar'
          ? 'خطوات مشياً'
          : currentLang === 'fr'
          ? 'Quelques minutes à pied'
          : currentLang === 'es'
          ? 'A pie en pocos minutos'
          : currentLang === 'de'
          ? 'Wenige Gehminuten'
          : 'Short walk',
      desc:
        currentLang === 'ar'
          ? 'شاطئ رملي واسع ونظيف يتميز بالهدوء والنسيم العليل.'
          : currentLang === 'fr'
          ? 'Grande plage sauvage et tranquille, idéale pour la baignade et les balades.'
          : currentLang === 'es'
          ? 'Extensa playa virgen de arena dorada, idónea para paseos y baños tranquilos.'
          : currentLang === 'de'
          ? 'Weiter, unberührter Sandstrand, ideal für erholsame Spaziergänge und Baden.'
          : 'Uncrowded, pristine golden sandy beach ideal for walks, swimming, and sunsets.'
    },
    {
      name:
        currentLang === 'ar'
          ? 'مصب وادي تاهدارت'
          : currentLang === 'fr'
          ? 'Estuaire de Tahaddart'
          : currentLang === 'es'
          ? 'Estuario de Tahaddart'
          : currentLang === 'de'
          ? 'Mündung & Feuchtgebiet Tahaddart'
          : 'Tahaddart Estuary & Nature',
      distance: '6 km (6 min)',
      desc:
        currentLang === 'ar'
          ? 'فضاء طبيعي مميز لهواة الطيور المهاجرة والتنزه الهادئ.'
          : currentLang === 'fr'
          ? 'Réserve naturelle estuarienne propice à l’observation des oiseaux.'
          : currentLang === 'es'
          ? 'Reserva natural litoral perfecta para contemplar aves migratorias y pasear.'
          : currentLang === 'de'
          ? 'Naturschutzgebiet an der Mündung, ideal für Vogelbeobachtung und Naturspaziergänge.'
          : 'Picturesque coastal estuary popular for migratory birds, peaceful waters, and walks.'
    },
    {
      name:
        currentLang === 'ar'
          ? 'مطار طنجة ابن بطوطة'
          : currentLang === 'fr'
          ? 'Aéroport Tanger Ibn Battouta'
          : currentLang === 'es'
          ? 'Aeropuerto de Tánger Ibn Battouta'
          : currentLang === 'de'
          ? 'Flughafen Tanger Ibn Battouta (TNG)'
          : 'Tangier Ibn Battuta Airport (TNG)',
      distance: '32 km (30 min)',
      desc:
        currentLang === 'ar'
          ? 'رحلات جوية دولية مباشرة من مختلف العواصم الأوروبية.'
          : currentLang === 'fr'
          ? 'Vols directs quotidiens depuis la France, la Belgique, l’Espagne et l’Europe.'
          : currentLang === 'es'
          ? 'Vuelos directos y conexiones rápidas con España y principales ciudades europeas.'
          : currentLang === 'de'
          ? 'Direktflüge und gute Anbindungen nach Deutschland, Frankreich und ganz Europa.'
          : 'Direct domestic and international flights from across Europe.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
          {t.brandName} · Briech
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.locationTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t.locationSubtitle}
        </p>
      </div>

      {/* Map Embed Card */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="aspect-16/9 sm:aspect-21/9 w-full bg-slate-100 relative">
          <iframe
            title="Ghorob Chams Residence Location in Briech"
            src={settings.googleMapsEmbedUrl}
            className="w-full h-full border-0"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-6 sm:p-8 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-200">
          <div className="flex items-start gap-3.5">
            <MapPin className="w-6 h-6 text-sky-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 text-sm sm:text-base">
                {settings.address[currentLang] || settings.address.en}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                GPS: 35.5398° N, -5.9890° W · Commune de Briech, Préfecture de Tanger-Assilah
              </p>
            </div>
          </div>

          <a
            href={settings.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>{t.openGoogleMaps}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Getting There: 3 Transport Options */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
          {t.gettingThereTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.byCarTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.byCarDesc}
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Train className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.byTrainTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.byTrainDesc}
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t.byAirTitle}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.byAirDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Nearby Points of Interest */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">
          {currentLang === 'ar' ? 'أماكن مميزة بالقرب من الإقامة' : currentLang === 'fr' ? 'À Découvrir aux Alentours' : 'Nearby Attractions & Distances'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nearbyPOIs.map((poi, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {poi.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {poi.desc}
                </p>
              </div>
              <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-md shrink-0 tabular-nums">
                {poi.distance}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
