import React, { useState, useRef, useEffect } from 'react';
import { Logo } from './Logo';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { Menu, X, MessageCircle, Shield, Globe, ChevronDown, Check } from 'lucide-react';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  activePage: string;
  onNavigate: (page: string, param?: string) => void;
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activePage,
  onNavigate,
  settings,
  onOpenBooking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const t = translations[currentLang] || translations.en;

  const navLinks = [
    { id: 'home', label: t.navHome },
    { id: 'apartments', label: t.navApartments },
    { id: 'gallery', label: t.navGallery },
    { id: 'location', label: t.navLocation },
    { id: 'about', label: t.navAbout },
    { id: 'contact', label: t.navContact }
  ];

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setLangDropdownOpen(false);
  };

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsAppGreeting = encodeURIComponent(
    currentLang === 'ar'
      ? 'السلام عليكم، أود الاستفسار عن حجز شقة في إقامة غروب شمس ببريش.'
      : currentLang === 'fr'
      ? 'Bonjour, je souhaite me renseigner pour une réservation à la Résidence Ghorob Chams à Briech.'
      : currentLang === 'es'
      ? 'Hola, deseo solicitar información sobre el alquiler de un apartamento en la Residencia Ghorob Chams en Briech.'
      : currentLang === 'de'
      ? 'Guten Tag, ich möchte mich über eine Buchung in der Residenz Ghorob Chams in Briech erkundigen.'
      : 'Hello, I would like to inquire about booking an apartment at Ghorob Chams Residence in Briech.'
  );

  const currentLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark & Emblem */}
          <button
            onClick={() => handleLinkClick('home')}
            className="flex items-center text-left hover:opacity-95 transition-opacity focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-600 rounded-lg p-1 shrink-0"
            aria-label="Ghorob Chams Residence Home"
          >
            <Logo variant="dark" />
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-sm font-medium tracking-tight whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                    isActive
                      ? 'text-sky-800 border-sky-600 font-semibold'
                      : 'text-slate-600 border-transparent hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language Selector, Admin & Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {/* Multilingual Selector Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-800 transition-colors"
                aria-expanded={langDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select language"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="font-medium">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {langDropdownOpen && (
                <div className="absolute end-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Language / اللغة
                  </div>
                  {SUPPORTED_LANGUAGES.map(lang => {
                    const isSelected = currentLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleLanguageSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors text-start ${
                          isSelected
                            ? 'bg-sky-50 text-sky-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-700" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Admin Portal Toggle */}
            <button
              onClick={() => handleLinkClick('admin')}
              className={`p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
                activePage === 'admin' ? 'bg-slate-100 text-sky-700' : ''
              }`}
              title={t.navAdmin}
              aria-label={t.navAdmin}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 active:scale-95"
            >
              <span>{t.btnBookStay}</span>
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Quick Lang Dropdown button */}
            <button
              onClick={() => {
                const currentIndex = SUPPORTED_LANGUAGES.findIndex(l => l.code === currentLang);
                const nextLang = SUPPORTED_LANGUAGES[(currentIndex + 1) % SUPPORTED_LANGUAGES.length].code;
                onLanguageChange(nextLang);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg border border-slate-200"
              aria-label="Switch language"
            >
              <span>{currentLangObj.flag}</span>
              <span>{currentLangObj.code.toUpperCase()}</span>
            </button>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg focus-visible:outline-hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-1 pb-4">
            {navLinks.map(link => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`text-start px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            <button
              onClick={() => handleLinkClick('admin')}
              className={`text-start px-3 py-2.5 text-base font-medium rounded-lg flex items-center gap-2 transition-colors ${
                activePage === 'admin'
                  ? 'bg-sky-50 text-sky-800 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>{t.navAdmin}</span>
            </button>
          </div>

          {/* Mobile All Languages Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-2">
              Select Language / اختر اللغة
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    handleLanguageSelect(lang.code);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    currentLang === lang.code
                      ? 'bg-sky-800 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="mt-5 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold text-center rounded-xl shadow-xs"
            >
              {t.btnBookStay}
            </button>
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppGreeting}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-center rounded-xl flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.btnWhatsAppDirect}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
