import React, { useState, useEffect } from 'react';
import { Apartment, Language, SiteSettings } from '../types';
import { translations } from '../data/translations';
import { apiSubmitInquiry } from '../services/api';
import { X, Calendar, MessageCircle, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  apartments: Apartment[];
  selectedApartment: Apartment | null;
  currentLang: Language;
  settings: SiteSettings;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  apartments,
  selectedApartment,
  currentLang,
  settings
}) => {
  const t = translations[currentLang];

  const [formData, setFormData] = useState({
    guestName: '',
    phone: '',
    countryCode: '+212',
    email: '',
    apartmentId: '',
    checkIn: '',
    checkOut: '',
    guestsCount: 2,
    message: '',
    honeypot: '' // Anti-spam trap
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    apartmentTitle: string;
    checkIn: string;
    checkOut: string;
    estimatedTotal: number;
  } | null>(null);

  // Set default check-in (tomorrow) and check-out (3 days after)
  useEffect(() => {
    if (isOpen) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 4);

      const checkInStr = tomorrow.toISOString().split('T')[0];
      const checkOutStr = dayAfter.toISOString().split('T')[0];

      setFormData(prev => ({
        ...prev,
        apartmentId: selectedApartment ? selectedApartment.id : apartments[0]?.id || '',
        checkIn: prev.checkIn || checkInStr,
        checkOut: prev.checkOut || checkOutStr
      }));
      setErrorMsg(null);
      setSuccessData(null);
    }
  }, [isOpen, selectedApartment, apartments]);

  if (!isOpen) return null;

  const currentApt =
    apartments.find(a => a.id === formData.apartmentId) || selectedApartment || apartments[0];

  // Calculate nights and price
  let nights = 0;
  if (formData.checkIn && formData.checkOut) {
    const inDate = new Date(formData.checkIn);
    const outDate = new Date(formData.checkOut);
    nights = Math.max(0, Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24)));
  }
  const estimatedTotal = nights * (currentApt ? currentApt.pricePerNight : 500);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Spam check
    if (formData.honeypot) {
      return;
    }

    // Validation
    if (!formData.guestName.trim()) {
      setErrorMsg(
        currentLang === 'ar'
          ? 'يرجى إدخال الاسم الكامل.'
          : currentLang === 'fr'
          ? 'Veuillez saisir votre nom complet.'
          : currentLang === 'es'
          ? 'Por favor, introduzca su nombre completo.'
          : currentLang === 'de'
          ? 'Bitte geben Sie Ihren vollständigen Namen ein.'
          : 'Please enter your full name.'
      );
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg(
        currentLang === 'ar'
          ? 'يرجى إدخال رقم هاتف صحيح للتواصل عبر واتساب.'
          : currentLang === 'fr'
          ? 'Veuillez entrer un numéro WhatsApp valide.'
          : currentLang === 'es'
          ? 'Por favor, introduzca un número de teléfono/WhatsApp válido.'
          : currentLang === 'de'
          ? 'Bitte geben Sie eine gültige Telefon-/WhatsApp-Nummer ein.'
          : 'Please enter a valid WhatsApp phone number.'
      );
      return;
    }
    if (nights <= 0) {
      setErrorMsg(
        currentLang === 'ar'
          ? 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول.'
          : currentLang === 'fr'
          ? 'La date de départ doit être après la date d’arrivée.'
          : currentLang === 'es'
          ? 'La fecha de salida debe ser posterior a la de llegada.'
          : currentLang === 'de'
          ? 'Das Abreisedatum muss nach dem Anreisedatum liegen.'
          : 'Check-out date must be after check-in date.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await apiSubmitInquiry({
        guestName: formData.guestName,
        phone: `${formData.countryCode} ${formData.phone}`,
        countryCode: formData.countryCode,
        email: formData.email,
        apartmentId: currentApt?.id,
        apartmentTitle:
          currentApt?.title[currentLang] ||
          currentApt?.title.es ||
          currentApt?.title.de ||
          currentApt?.title.en ||
          'Apartment',
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guestsCount: formData.guestsCount,
        message: formData.message,
        estimatedTotal
      });

      setSuccessData({
        reference: data.reference,
        apartmentTitle:
          currentApt?.title[currentLang] ||
          currentApt?.title.es ||
          currentApt?.title.de ||
          currentApt?.title.en ||
          'Apartment',
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        estimatedTotal
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while submitting your request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsAppNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  const whatsAppDirectMessage = successData
    ? encodeURIComponent(
        currentLang === 'ar'
          ? `السلام عليكم، لقد أرسلت طلب حجز شقة في إقامة غروب شمس بريش.\nرقم المرجع: ${successData.reference}\nالشقة: ${successData.apartmentTitle}\nالوصول: ${successData.checkIn} - المغادرة: ${successData.checkOut}\nالاسم: ${formData.guestName}`
          : currentLang === 'fr'
          ? `Bonjour, je viens de soumettre une demande de réservation pour la Résidence Ghorob Chams Briech.\nRéférence: ${successData.reference}\nLogement: ${successData.apartmentTitle}\nDu ${successData.checkIn} au ${successData.checkOut}\nNom: ${formData.guestName}`
          : currentLang === 'es'
          ? `Hola, acabo de enviar una solicitud de reserva para la Residencia Ghorob Chams Briech.\nReferencia: ${successData.reference}\nAlojamiento: ${successData.apartmentTitle}\nFechas: del ${successData.checkIn} al ${successData.checkOut}\nNombre: ${formData.guestName}`
          : currentLang === 'de'
          ? `Guten Tag, ich habe soeben eine Buchungsanfrage für die Residenz Ghorob Chams Briech gesendet.\nReferenz: ${successData.reference}\nUnterkunft: ${successData.apartmentTitle}\nZeitraum: vom ${successData.checkIn} bis ${successData.checkOut}\nName: ${formData.guestName}`
          : `Hello, I just submitted a booking inquiry for Ghorob Chams Residence in Briech.\nReference: ${successData.reference}\nApartment: ${successData.apartmentTitle}\nDates: ${successData.checkIn} to ${successData.checkOut}\nName: ${formData.guestName}`
      )
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {successData ? t.inquirySuccessTitle : t.bookingModalTitle}
            </h2>
            <p className="text-xs text-sky-200 font-medium">
              Ghorob Chams Residence · Briech, Morocco
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {successData ? (
            /* Success Confirmation Screen */
            <div className="flex flex-col items-center text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t.inquirySuccessTitle}
                </h3>
                <p className="text-sm text-slate-600 mt-1 max-w-md">
                  {t.inquirySuccessMsg}
                </p>
                <div className="mt-2 inline-block px-4 py-1.5 bg-slate-100 rounded-lg text-slate-900 font-mono font-bold text-base tracking-wider border border-slate-200">
                  {successData.reference}
                </div>
              </div>

              {/* Inquiry Summary Box */}
              <div className="w-full bg-slate-50 rounded-xl p-4 text-start border border-slate-200/80 text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.navApartments}:</span>
                  <span className="font-semibold text-slate-800">{successData.apartmentTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t.checkInLabel} / {t.checkOutLabel}:</span>
                  <span className="font-medium text-slate-800">
                    {successData.checkIn} → {successData.checkOut} ({nights} {t.nights})
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
                  <span className="text-slate-700">{t.estimatedTotal}:</span>
                  <span className="text-sky-900 font-bold tabular-nums">
                    {successData.estimatedTotal} {settings.currency}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md">
                {t.inquirySuccessFollowUp}
              </p>

              {/* Actions */}
              <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${cleanWhatsAppNumber}?text=${whatsAppDirectMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.chatNowWhatsApp}</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Honeypot for spam */}
              <input
                type="text"
                name="user_nickname_hp"
                value={formData.honeypot}
                onChange={e => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Apartment Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.navApartments}
                </label>
                <select
                  value={formData.apartmentId}
                  onChange={e => setFormData({ ...formData, apartmentId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                >
                  {apartments.map(apt => (
                    <option key={apt.id} value={apt.id}>
                      {apt.title[currentLang] || apt.title.en} — {apt.pricePerNight} {apt.currency}/night
                    </option>
                  ))}
                </select>
              </div>

              {/* Guest Name & WhatsApp Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.guestNameLabel} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t.guestNamePlaceholder}
                    value={formData.guestName}
                    onChange={e => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.phoneLabel} *
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={formData.countryCode}
                      onChange={e => setFormData({ ...formData, countryCode: e.target.value })}
                      className="w-24 px-2 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-700"
                    >
                      <option value="+212">🇲🇦 +212</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+966">🇸🇦 +966</option>
                    </select>
                    <input
                      type="tel"
                      required
                      placeholder="661 23 45 67"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Dates & Guests Count */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkInLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.checkOutLabel} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkOut}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.guestsCountLabel}
                  </label>
                  <select
                    value={formData.guestsCount}
                    onChange={e => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>
                        {num} {t.filterGuests}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Calculation Box */}
              {nights > 0 && (
                <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-600 font-medium">
                      {nights} {nights === 1 ? t.night : t.nights} × {currentApt?.pricePerNight} {settings.currency}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {t.pricingNote}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">{t.estimatedTotal}</span>
                    <span className="text-base sm:text-lg font-bold text-sky-900 tabular-nums">
                      {estimatedTotal} {settings.currency}
                    </span>
                  </div>
                </div>
              )}

              {/* Additional message */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.messageLabel}
                </label>
                <textarea
                  rows={2}
                  placeholder={t.messagePlaceholder}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-600 focus:bg-white"
                />
              </div>

              {/* Trust & Direct Contact notice */}
              <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.transparentNotice}</span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-70 text-white font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isSubmitting ? t.submitting : t.submitInquiry}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
