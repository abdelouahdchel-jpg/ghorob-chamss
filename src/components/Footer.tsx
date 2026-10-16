import React from 'react';
import { Logo } from './Logo';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { Phone, Mail, MapPin, MessageCircle, Shield } from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onNavigate: (page: string) => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate, settings }) => {
  const t = translations[currentLang];
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <Logo variant="light" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentLang === 'ar'
                ? 'إقامة شقق عطلات مفروشة في بريش، على بعد 10 كلم فقط شمال أصيلة. نسيم البحر، إطلالات الغروب، وأجواء ساحلية هادئة.'
                : currentLang === 'fr'
                ? 'Appartements de vacances meublés à Briech, à seulement 10 km au nord d’Assilah. Brise marine, couchers de soleil et calme absolu.'
                : currentLang === 'es'
                ? 'Apartamentos vacacionales amueblados en Briech, a solo 10 km al norte de Arcila. Brisas atlánticas, atardeceres dorados y calma absoluta.'
                : currentLang === 'de'
                ? 'Möblierte Ferienunterkünfte in Briech, nur 10 km nördlich von Asilah. Meeresbrise, Sonnenuntergänge und absolute Ruhe.'
                : 'Furnished holiday rental apartments in Briech, just 10 km north of Asilah. Atlantic breezes, sunset balconies, and serene coastal living.'}
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${cleanWhatsAppNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-500/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {settings.whatsappDisplay || settings.whatsappNumber}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {currentLang === 'ar'
                ? 'روابط الموقع'
                : currentLang === 'fr'
                ? 'Navigation'
                : currentLang === 'es'
                ? 'Navegación'
                : currentLang === 'de'
                ? 'Navigation'
                : 'Site Links'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('apartments')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.navApartments}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.navGallery}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('location')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.navLocation}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.navAbout}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  {t.navContact}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Location & Surrounding */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {currentLang === 'ar'
                ? 'الموقع والشواطئ'
                : currentLang === 'fr'
                ? 'Situation'
                : currentLang === 'es'
                ? 'Ubicación'
                : currentLang === 'de'
                ? 'Lage & Umgebung'
                : 'Location Highlights'}
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>{settings.address[currentLang] || settings.address.en}</span>
              </div>
              <p className="text-xs text-slate-400 pt-1">
                • {t.distanceAsilah}
                <br />• {t.distanceAirport}
                <br />• {t.distanceBeach}
              </p>
            </div>
          </div>

          {/* Col 4: Direct Inquiries & Owner Portal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              {t.directContactTitle}
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
              <div className="pt-3">
                <button
                  onClick={() => onNavigate('admin')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700"
                >
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.navAdmin}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} إقامة غروب شمس | Ghorob Chams Residence. {t.allRightsReserved}
          </p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-300 transition-colors"
            >
              {t.privacyPolicy}
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-300 transition-colors"
            >
              {t.termsConditions}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
