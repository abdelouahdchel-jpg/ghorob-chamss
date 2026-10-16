import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TermsViewProps {
  currentLang: Language;
}

export const TermsView: React.FC<TermsViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
          Ghorob Chams Residence · Briech
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.termsConditions}
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Rental Policies & House Rules · Ghorob Chams Residence (Briech / Asilah, Morocco)
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-700" />
            <span>1. Scope & Reservation Inquiries</span>
          </h2>
          <p>
            Submission of a booking form via this website constitutes a reservation inquiry, not an automatic confirmation. Confirmation is concluded upon mutual agreement with the property manager via WhatsApp or direct written communication.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Check-in & Identification Requirements</span>
          </h2>
          <p>
            Standard check-in begins at 15:00 and check-out is before 11:00. In accordance with Moroccan laws governing tourist and holiday rentals, all adult guests must present valid identification (National ID card for Moroccan citizens or valid passports for international visitors) upon check-in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>3. Residential Peace & Family Atmosphere</span>
          </h2>
          <p>
            Ghorob Chams Residence is located in a serene coastal community in Briech. Loud parties, illegal activities, and excessive noise late at night are strictly prohibited to maintain the peaceful tranquility of the residence and neighborhood.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Cancellations & Modifications</h2>
          <p>
            Any requested changes to arrival or departure dates must be communicated directly via WhatsApp as early as possible so dates can be adjusted or released.
          </p>
        </section>
      </div>
    </div>
  );
};
