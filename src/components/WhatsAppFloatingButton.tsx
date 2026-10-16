import React from 'react';
import { Language, SiteSettings } from '../types';
import { MessageCircle } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  settings: SiteSettings;
  currentLang: Language;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  settings,
  currentLang
}) => {
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const greeting = encodeURIComponent(
    currentLang === 'ar'
      ? 'السلام عليكم، أود الاستفسار عن حجز شقة في إقامة غروب شمس ببريش.'
      : currentLang === 'fr'
      ? 'Bonjour, je souhaite me renseigner pour une réservation à la Résidence Ghorob Chams à Briech.'
      : currentLang === 'es'
      ? 'Hola, deseo consultar disponibilidad para alquilar un apartamento en la Residencia Ghorob Chams en Briech.'
      : currentLang === 'de'
      ? 'Guten Tag, ich möchte mich über eine Buchung in der Residenz Ghorob Chams in Briech erkundigen.'
      : 'Hello, I would like to inquire about booking an apartment at Ghorob Chams Residence in Briech.'
  );

  const label =
    currentLang === 'ar'
      ? 'احجز عبر واتساب'
      : currentLang === 'fr'
      ? 'Réserver via WhatsApp'
      : currentLang === 'es'
      ? 'Reservar por WhatsApp'
      : currentLang === 'de'
      ? 'Per WhatsApp anfragen'
      : 'WhatsApp Booking';

  return (
    <aside
      aria-label="WhatsApp reservation contact"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group"
    >
      <span className="hidden sm:inline-block px-3 py-1.5 bg-slate-900/90 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none">
        {label}
      </span>
      <a
        href={`https://wa.me/${cleanNumber}?text=${greeting}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <MessageCircle className="w-7 h-7 fill-white/20" />
      </a>
    </aside>
  );
};
