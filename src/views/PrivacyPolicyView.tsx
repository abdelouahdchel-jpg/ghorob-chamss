import React from 'react';
import { Language } from '../types';
import { translations } from '../data/translations';
import { Shield, Lock, FileText } from 'lucide-react';

interface PrivacyPolicyViewProps {
  currentLang: Language;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-sky-700 uppercase tracking-widest block mb-1">
          Ghorob Chams Residence · Briech
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.privacyPolicy}
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Effective Date: October 2026 · Conforming to Law 09-08 on Personal Data Protection (CNDP - Morocco)
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-700" />
            <span>1. Commitment to Guest Privacy</span>
          </h2>
          <p>
            At Ghorob Chams Residence (إقامة غروب شمس), located in Briech, Morocco, we treat guest privacy and personal data with the highest discretion. We do not sell, rent, or share personal contact information with third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-700" />
            <span>2. Information We Collect</span>
          </h2>
          <p>
            When submitting a booking inquiry, we collect only necessary reservation details: your name, phone/WhatsApp number, requested dates, and number of guests. This information is strictly used to reply to your inquiry, check accommodation availability, and coordinate your check-in.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-700" />
            <span>3. Direct WhatsApp & Communication</span>
          </h2>
          <p>
            Communication initiated via WhatsApp is subject to WhatsApp/Meta encryption standards. You have full control over your conversation history and may request deletion of your inquiry details from our records at any time by contacting our property manager.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900">4. Payment & Financial Data</h2>
          <p>
            This website does not store bank cards or process online transactions. Any financial settlements are finalized directly with the property host in compliance with Moroccan holiday rental regulations.
          </p>
        </section>
      </div>
    </div>
  );
};
