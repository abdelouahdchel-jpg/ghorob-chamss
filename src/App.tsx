/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Language, Apartment, SiteSettings } from './types';
import { initialApartments, initialSettings } from './data/initialData';
import { translations } from './data/translations';
import { detectVisitorLanguage, setLanguagePreference, applyLanguageToDOM } from './i18n';
import { apiFetchApartments, apiFetchSettings } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { HomeView } from './views/HomeView';
import { ApartmentsView } from './views/ApartmentsView';
import { ApartmentDetailView } from './views/ApartmentDetailView';
import { AboutView } from './views/AboutView';
import { GalleryView } from './views/GalleryView';
import { LocationView } from './views/LocationView';
import { ContactView } from './views/ContactView';
import { PrivacyPolicyView } from './views/PrivacyPolicyView';
import { TermsView } from './views/TermsView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { NotFoundView } from './views/NotFoundView';

export default function App() {
  // 1. Automatic visitor language detection (browser detection + saved preference)
  const [currentLang, setCurrentLang] = useState<Language>(() => detectVisitorLanguage());

  // Active View & Route State
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(null);

  // Data State with Backend Persistence & local fallback
  const [apartments, setApartments] = useState<Apartment[]>(initialApartments);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingModalApartment, setBookingModalApartment] = useState<Apartment | null>(null);

  // Handle manual language switch
  const handleLanguageChange = (newLang: Language) => {
    setCurrentLang(newLang);
    setLanguagePreference(newLang);
  };

  // Synchronize DOM attributes and SEO metadata on language or page change
  useEffect(() => {
    applyLanguageToDOM(currentLang);

    const t = translations[currentLang] || translations.en;

    // Translated page titles & meta descriptions
    let pageTitle = `${t.brandName} | ${t.heroHeadline}`;
    let pageDesc = t.heroSubtitle;

    if (activePage === 'apartments') {
      pageTitle = `${t.brandName} | ${t.navApartments}`;
      pageDesc = t.featuredSubtitle;
    } else if (activePage === 'about') {
      pageTitle = `${t.brandName} | ${t.navAbout}`;
      pageDesc = t.aboutStoryTitle;
    } else if (activePage === 'gallery') {
      pageTitle = `${t.brandName} | ${t.navGallery}`;
      pageDesc = t.gallerySubtitle;
    } else if (activePage === 'location') {
      pageTitle = `${t.brandName} | ${t.navLocation}`;
      pageDesc = t.locationSubtitle;
    } else if (activePage === 'contact') {
      pageTitle = `${t.brandName} | ${t.navContact}`;
      pageDesc = t.contactSubtitle;
    }

    document.title = pageTitle;

    // Update meta description tag
    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', pageDesc);
    }
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', pageTitle);
    }
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute('content', pageDesc);
    }
  }, [currentLang, activePage]);

  // Load from Portable Backend API (with graceful static fallback)
  const refreshData = useCallback(async () => {
    try {
      const [fetchedApts, fetchedSettings] = await Promise.all([
        apiFetchApartments(),
        apiFetchSettings()
      ]);
      setApartments(fetchedApts);
      setSettings(fetchedSettings);
    } catch (e) {
      console.warn('Backend API connection fallback to local data', e);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setActivePage('home');
        setSelectedApartmentId(null);
      } else if (hash.startsWith('apartment/')) {
        const id = hash.replace('apartment/', '');
        setSelectedApartmentId(id);
        setActivePage('apartment-detail');
      } else {
        setActivePage(hash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: string, param?: string) => {
    if (page === 'apartment-detail' && param) {
      window.location.hash = `apartment/${param}`;
      setSelectedApartmentId(param);
      setActivePage('apartment-detail');
    } else if (page === 'home') {
      window.location.hash = '';
      setSelectedApartmentId(null);
      setActivePage('home');
    } else {
      window.location.hash = page;
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenBooking = (apt?: Apartment) => {
    setBookingModalApartment(apt || null);
    setBookingModalOpen(true);
  };

  const selectedApartment =
    apartments.find(a => a.id === selectedApartmentId || a.slug === selectedApartmentId) ||
    apartments[0];

  return (
    <div
      className={`min-h-screen flex flex-col bg-stone-50 text-slate-800 ${
        currentLang === 'ar' ? 'font-arabic' : 'font-display'
      }`}
    >
      {/* Universal Top Navigation with Automatic & Manual Multilingual Selector */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        activePage={activePage}
        onNavigate={navigateTo}
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomeView
            currentLang={currentLang}
            settings={settings}
            apartments={apartments}
            onNavigate={navigateTo}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {activePage === 'apartments' && (
          <ApartmentsView
            currentLang={currentLang}
            settings={settings}
            apartments={apartments}
            onSelectApartment={apt => navigateTo('apartment-detail', apt.id)}
            onRequestBooking={handleOpenBooking}
          />
        )}

        {activePage === 'apartment-detail' && selectedApartment && (
          <ApartmentDetailView
            apartment={selectedApartment}
            currentLang={currentLang}
            settings={settings}
            onBack={() => navigateTo('apartments')}
            onRequestBooking={handleOpenBooking}
          />
        )}

        {activePage === 'about' && (
          <AboutView
            currentLang={currentLang}
            settings={settings}
            onNavigate={navigateTo}
          />
        )}

        {activePage === 'gallery' && (
          <GalleryView currentLang={currentLang} />
        )}

        {activePage === 'location' && (
          <LocationView
            currentLang={currentLang}
            settings={settings}
          />
        )}

        {activePage === 'contact' && (
          <ContactView
            currentLang={currentLang}
            settings={settings}
          />
        )}

        {activePage === 'privacy' && (
          <PrivacyPolicyView currentLang={currentLang} />
        )}

        {activePage === 'terms' && (
          <TermsView currentLang={currentLang} />
        )}

        {activePage === 'admin' && (
          <AdminDashboardView
            currentLang={currentLang}
            settings={settings}
            apartments={apartments}
            onRefreshData={refreshData}
            onNavigateHome={() => navigateTo('home')}
          />
        )}

        {![
          'home',
          'apartments',
          'apartment-detail',
          'about',
          'gallery',
          'location',
          'contact',
          'privacy',
          'terms',
          'admin'
        ].includes(activePage) && (
          <NotFoundView
            currentLang={currentLang}
            onNavigateHome={() => navigateTo('home')}
          />
        )}
      </main>

      {/* Floating WhatsApp Contact Button */}
      <WhatsAppFloatingButton
        settings={settings}
        currentLang={currentLang}
      />

      {/* Booking Inquiry Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        apartments={apartments}
        selectedApartment={bookingModalApartment}
        currentLang={currentLang}
        settings={settings}
      />

      {/* Quiet Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={navigateTo}
        settings={settings}
      />
    </div>
  );
}
