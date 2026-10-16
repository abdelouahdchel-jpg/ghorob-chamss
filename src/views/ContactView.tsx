import React, { useState } from 'react';
import { Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

interface ContactViewProps {
  currentLang: Language;
  settings: SiteSettings;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentLang, settings }) => {
  const t = translations[currentLang];
  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    hp: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contactForm.hp) return;
    setError(null);

    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      setError(
        currentLang === 'ar'
          ? 'يرجى إدخال الاسم ورقم الهاتف للتواصل.'
          : 'Please enter your name and contact phone number.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit as general inquiry to /api/inquiries
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestName: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email,
          apartmentId: 'general-contact',
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          guestsCount: 1,
          message: `[Subject: ${contactForm.subject || 'General inquiry'}] ${contactForm.message}`
        })
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setContactForm({ name: '', phone: '', email: '', subject: '', message: '', hp: '' });
    } catch (err: any) {
      setError(err.message || 'Error sending message. Please contact via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsAppDirectMsg = encodeURIComponent(
    currentLang === 'ar'
      ? 'السلام عليكم، أود التواصل بخصوص إقامة غروب شمس ببريش.'
      : currentLang === 'fr'
      ? 'Bonjour, je souhaite vous contacter au sujet de la Résidence Ghorob Chams à Briech.'
      : currentLang === 'es'
      ? 'Hola, deseo comunicarme respecto a la Residencia Ghorob Chams en Briech.'
      : currentLang === 'de'
      ? 'Guten Tag, ich möchte bezüglich der Residenz Ghorob Chams in Briech Kontakt aufnehmen.'
      : 'Hello, I would like to inquire about Ghorob Chams Residence in Briech.'
  );

  const faqs = [
    {
      q:
        currentLang === 'ar'
          ? 'هل الشقق مفروشة بالكامل؟'
          : currentLang === 'fr'
          ? 'Les appartements sont-ils entièrement équipés ?'
          : currentLang === 'es'
          ? '¿Los apartamentos están totalmente amueblados?'
          : currentLang === 'de'
          ? 'Sind die Wohnungen komplett möbliert und ausgestattet?'
          : 'Are the apartments fully furnished?',
      a:
        currentLang === 'ar'
          ? 'نعم، جميع الشقق مجهزة بأثاث مريح، أسرّة مع أفرشة نظيفة، مطابخ مجهزة بالأواني وثلاجة وموقد، بالإضافة إلى أجهزة تلفاز وواي فاي.'
          : currentLang === 'fr'
          ? 'Oui, tous les logements disposent d’une literie complète, de serviettes propres, d’une cuisine équipée (réfrigérateur, plaques, vaisselle) et du WiFi.'
          : currentLang === 'es'
          ? 'Sí, todos los alojamientos disponen de ropa de cama limpia, toallas, cocina equipada con menaje, nevera, vitrocerámica, televisión y WiFi.'
          : currentLang === 'de'
          ? 'Ja, alle Unterkünfte bieten frische Bettwäsche, Handtücher, eine voll ausgestattete Küche mit Kühlschrank, Herd, Kochutensilien, TV und Highspeed-WLAN.'
          : 'Yes, every apartment includes clean bed linens, towels, a fully equipped kitchen with cookware and refrigerator, TV, and high-speed WiFi.'
    },
    {
      q:
        currentLang === 'ar'
          ? 'هل يتوفر موقف سيارات مجاني؟'
          : currentLang === 'fr'
          ? 'Le stationnement est-il sécurisé et gratuit ?'
          : currentLang === 'es'
          ? '¿El aparcamiento es gratuito y seguro?'
          : currentLang === 'de'
          ? 'Ist der Parkplatz kostenlos und gesichert?'
          : 'Is free parking available?',
      a:
        currentLang === 'ar'
          ? 'نعم، تتوفر الإقامة على مواقف سيارات خاصة ومحروسة ومجانية لجميع الضيوف.'
          : currentLang === 'fr'
          ? 'Oui, la résidence dispose d’un parking gratuit et sécurisé pour les résidents.'
          : currentLang === 'es'
          ? 'Sí, la residencia cuenta con aparcamiento privado, gratuito y vigilado para los huéspedes.'
          : currentLang === 'de'
          ? 'Ja, die Residenz bietet kostenlose und gesicherte Privatparkplätze auf dem Grundstück.'
          : 'Yes, secure and free private parking is available on-site for all guests.'
    },
    {
      q:
        currentLang === 'ar'
          ? 'كيف يتم تأكيد الحجز والدفع؟'
          : currentLang === 'fr'
          ? 'Comment se déroulent la réservation et le règlement ?'
          : currentLang === 'es'
          ? '¿Cómo funciona la reserva y el pago?'
          : currentLang === 'de'
          ? 'Wie läuft die Reservierung und Bezahlung ab?'
          : 'How does reservation and payment work?',
      a:
        currentLang === 'ar'
          ? 'التأكيد يتم مباشرة عبر الواتساب مع المالك. لا يتطلب الموقع أي دفع إلكتروني أو بطاقة بنكية مسبقة، ويكون الدفع حسب الاتفاق المباشر عند الوصول.'
          : currentLang === 'fr'
          ? 'La confirmation se fait en direct via WhatsApp avec le propriétaire. Aucun paiement en ligne n’est prélevé sur ce site ; le règlement s’effectue selon les modalités convenues directement.'
          : currentLang === 'es'
          ? 'La confirmación se realiza directamente por WhatsApp con el anfitrión. Este sitio no cobra ningún pago online; el abono se realiza a la llegada según lo acordado.'
          : currentLang === 'de'
          ? 'Die Bestätigung erfolgt direkt per WhatsApp mit dem Vermieter. Auf dieser Seite wird keine Online-Zahlung abgewickelt; die Bezahlung erfolgt nach Absprache bei Ankunft.'
          : 'Bookings are confirmed directly via WhatsApp with the owner. No online credit card payment is taken on this site; payment is settled directly upon arrival as agreed.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Title */}
      <div>
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
          {t.brandName} · Briech
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t.contactTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-2xl">
          {t.contactSubtitle}
        </p>
      </div>

      {/* Grid: Left Contact Info, Right Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Details Cards */}
        <div className="space-y-6">
          {/* WhatsApp Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-6 sm:p-7 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-emerald-950">{t.whatsappTitle}</h3>
                <p className="text-xs text-emerald-800">{t.whatsappSubtitle}</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-emerald-900 pt-1">
              {settings.whatsappDisplay || settings.whatsappNumber}
            </p>
            <a
              href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppDirectMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-xs"
            >
              <span>{t.chatNowWhatsApp}</span>
            </a>
          </div>

          {/* Phone & Email */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">
              {t.directContactTitle}
            </h3>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-700">
              <Phone className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-xs">{t.contactPhoneLabel}</span>
                <span className="font-semibold">{settings.contactPhone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
              <Mail className="w-5 h-5 text-sky-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-xs">{t.contactEmailLabel}</span>
                <span className="font-semibold">{settings.contactEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-xs">{t.openingHoursTitle}</span>
                <span className="font-medium">{t.openingHoursValue}</span>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
              <MapPin className="w-5 h-5 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 block text-xs">{t.locationAddressTitle}</span>
                <span className="font-medium">{settings.address[currentLang] || settings.address.en}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">
            {t.sendMessageTitle}
          </h2>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {currentLang === 'ar' ? 'تم إرسال رسالتكم بنجاح' : 'Message Sent Successfully'}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                {currentLang === 'ar'
                  ? 'شكراً لتواصلكم معنا. سنقوم بالرد عليكم في أقرب وقت عبر الواتساب أو الهاتف.'
                  : 'Thank you for reaching out. We will respond promptly via WhatsApp or phone.'}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg"
              >
                {currentLang === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot */}
              <input
                type="text"
                name="website_hp"
                value={contactForm.hp}
                onChange={e => setContactForm({ ...contactForm, hp: e.target.value })}
                className="hidden"
                tabIndex={-1}
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.guestNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.guestNamePlaceholder}
                  value={contactForm.name}
                  onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phoneLabel} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+212 6XX XX XX XX"
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.messageLabel} *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={t.messagePlaceholder}
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-sky-800 hover:bg-sky-900 disabled:opacity-70 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? t.submitting : t.submitInquiry}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-sky-700" />
          <span>{currentLang === 'ar' ? 'الأسئلة الشائعة للضيوف' : currentLang === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-sm text-slate-900">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
