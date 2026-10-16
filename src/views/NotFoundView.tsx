import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Compass, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  currentLang: Language;
  onNavigateHome: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ currentLang, onNavigateHome }) => {
  const t = translations[currentLang];

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800">
          {currentLang === 'ar'
            ? 'الصفحة غير موجودة'
            : currentLang === 'fr'
            ? 'Page non trouvée'
            : 'Page Not Found'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          {currentLang === 'ar'
            ? 'عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم تغيير مسارها.'
            : currentLang === 'fr'
            ? 'Désolé, la page que vous recherchez n’existe pas ou a été déplacée.'
            : 'Sorry, the coastal page you are looking for does not exist or has been moved.'}
        </p>
        <div className="pt-2">
          <button
            onClick={onNavigateHome}
            className="px-6 py-3 bg-sky-800 hover:bg-sky-900 text-white font-semibold rounded-xl text-sm transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.navHome}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
