import { Language } from '../types';

export interface TranslationDictionary {
  brandName: string;
  brandNameAr: string;
  tagline: string;
  subTagline: string;

  // Navigation
  navHome: string;
  navApartments: string;
  navAbout: string;
  navGallery: string;
  navLocation: string;
  navContact: string;
  navAdmin: string;

  // Hero & CTAs
  heroHeadline: string;
  heroSubtitle: string;
  btnExplore: string;
  btnBookStay: string;
  btnContactUs: string;
  btnWhatsAppDirect: string;
  btnViewDetails: string;
  btnRequestBooking: string;
  btnInquireWhatsApp: string;

  // Highlights & Why Choose Us
  whyTitle: string;
  whySubtitle: string;
  whyReason1Title: string;
  whyReason1Desc: string;
  whyReason2Title: string;
  whyReason2Desc: string;
  whyReason3Title: string;
  whyReason3Desc: string;
  whyReason4Title: string;
  whyReason4Desc: string;

  // Stats & Location Strip
  distanceAsilah: string;
  distanceAirport: string;
  distanceBeach: string;
  distanceTangierMed: string;

  // Apartments Section
  featuredTitle: string;
  featuredSubtitle: string;
  filterAll: string;
  filterSeaView: string;
  filterBedrooms: string;
  filterAnyBedrooms: string;
  filterGuests: string;
  filterAnyGuests: string;
  priceNight: string;
  priceMonth: string;
  fromPrice: string;
  furnishedStatus: string;
  unfurnishedStatus: string;
  seaViewLabel: string;
  balconyLabel: string;
  bedroomsLabel: string;
  bathroomsLabel: string;
  guestsMax: string;
  areaLabel: string;
  floorLabel: string;
  statusAvailable: string;
  statusReserved: string;
  statusMaintenance: string;
  demoNoticeBadge: string;
  demoNoticeExplanation: string;

  // Booking Form
  bookingModalTitle: string;
  guestNameLabel: string;
  guestNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  checkInLabel: string;
  checkOutLabel: string;
  guestsCountLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitInquiry: string;
  submitting: string;
  inquirySuccessTitle: string;
  inquirySuccessMsg: string;
  inquirySuccessFollowUp: string;
  chatNowWhatsApp: string;
  closeBtn: string;

  // Price Estimate
  stayDuration: string;
  nights: string;
  night: string;
  estimatedTotal: string;
  pricingNote: string;

  // Gallery Page
  galleryTitle: string;
  gallerySubtitle: string;
  galleryFilterAll: string;
  galleryFilterApartments: string;
  galleryFilterBalconies: string;
  galleryFilterBriech: string;

  // About Us Page
  aboutTitle: string;
  aboutStoryTitle: string;
  aboutP1: string;
  aboutP2: string;
  aboutP3: string;

  // Location Page
  locationTitle: string;
  locationSubtitle: string;
  gettingThereTitle: string;
  byCarTitle: string;
  byCarDesc: string;
  byTrainTitle: string;
  byTrainDesc: string;
  byAirTitle: string;
  byAirDesc: string;
  interactiveMapTitle: string;
  openGoogleMaps: string;

  // Contact Page
  contactTitle: string;
  contactSubtitle: string;
  directContactTitle: string;
  whatsappTitle: string;
  whatsappSubtitle: string;
  locationAddressTitle: string;
  openingHoursTitle: string;
  openingHoursValue: string;
  sendMessageTitle: string;

  // Footer & Policies
  privacyPolicy: string;
  termsConditions: string;
  allRightsReserved: string;
  footerNotice: string;

  // Admin Dashboard
  adminTitle: string;
  adminLoginTitle: string;
  adminPasswordLabel: string;
  adminLoginBtn: string;
  adminLogoutBtn: string;
  adminTabApartments: string;
  adminTabInquiries: string;
  adminTabSettings: string;
  addNewApartment: string;
  editApartment: string;
  deleteApartment: string;
  saveChanges: string;
  cancel: string;
  statusUpdated: string;
  inquiryStatusNew: string;
  inquiryStatusContacted: string;
  inquiryStatusConfirmed: string;
  inquiryStatusCancelled: string;
  actionWhatsAppGuest: string;
  noInquiriesYet: string;
  whatsappNumberConfigLabel: string;
  contactPhoneLabel: string;
  contactEmailLabel: string;
  saveSettingsBtn: string;
  settingsSavedSuccess: string;

  // Security & Spam Notice
  transparentNotice: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'Ghorob Chams Residence',
    brandNameAr: 'إقامة غروب شمس',
    tagline: 'Your Peaceful Coastal Stay in Briech, Morocco',
    subTagline: 'Furnished apartments near the sea, just 10 km from Asilah',
    navHome: 'Home',
    navApartments: 'Apartments',
    navAbout: 'About Us',
    navGallery: 'Gallery',
    navLocation: 'Location',
    navContact: 'Contact',
    navAdmin: 'Owner Portal',
    heroHeadline: 'Your Peaceful Coastal Stay in Briech, Morocco',
    heroSubtitle: 'Furnished holiday apartments near the sea, just 10 km from Asilah. Sunset ocean breezes, tranquility, and authentic northern Moroccan hospitality.',
    btnExplore: 'Explore Apartments',
    btnBookStay: 'Book Your Stay',
    btnContactUs: 'Contact Us',
    btnWhatsAppDirect: 'WhatsApp Reservation',
    btnViewDetails: 'View Apartment',
    btnRequestBooking: 'Request Booking',
    btnInquireWhatsApp: 'Inquire on WhatsApp',
    whyTitle: 'Why Choose Ghorob Chams Residence',
    whySubtitle: 'A tranquil seaside escape nestled between the Atlantic waves and the historic art town of Asilah',
    whyReason1Title: 'Steps from Atlantic Beaches',
    whyReason1Desc: 'Briech offers expansive, unspoiled sandy shores and serene sea breezes away from noisy city crowds.',
    whyReason2Title: '10 km from Historic Asilah',
    whyReason2Desc: 'Enjoy quick 10-minute access to Asilah’s whitewashed medina, vibrant art murals, ramparts, and seafood restaurants.',
    whyReason3Title: 'Fully Furnished & Equipped',
    whyReason3Desc: 'Modern kitchens, private sunset balconies, comfortable bedding, and dedicated family living spaces.',
    whyReason4Title: 'Direct Owner Care & Privacy',
    whyReason4Desc: 'Personalized check-in, transparent pricing, quiet residential atmosphere, and responsive WhatsApp communication.',
    distanceAsilah: '10 km to Asilah Medina',
    distanceAirport: '32 km to Tangier Airport',
    distanceBeach: 'Short walk to Briech Beach',
    distanceTangierMed: '65 km to Tangier Med Port',
    featuredTitle: 'Available Holiday Apartments',
    featuredSubtitle: 'Choose your coastal haven. Clear specifications, genuine amenities, and tranquil sunset views.',
    filterAll: 'All Apartments',
    filterSeaView: 'Sea View Only',
    filterBedrooms: 'Bedrooms',
    filterAnyBedrooms: 'Any Bedrooms',
    filterGuests: 'Guests',
    filterAnyGuests: 'Any Guests',
    priceNight: '/ night',
    priceMonth: '/ month',
    fromPrice: 'From',
    furnishedStatus: 'Furnished',
    unfurnishedStatus: 'Unfurnished',
    seaViewLabel: 'Sea View',
    balconyLabel: 'Private Balcony',
    bedroomsLabel: 'Bedrooms',
    bathroomsLabel: 'Bathrooms',
    guestsMax: 'Max Guests',
    areaLabel: 'Area',
    floorLabel: 'Floor',
    statusAvailable: 'Available',
    statusReserved: 'Reserved',
    statusMaintenance: 'Maintenance',
    demoNoticeBadge: 'Demo Content Notice',
    demoNoticeExplanation: 'This is a sample demonstration listing for website preview. Real availability and seasonal pricing are confirmed directly with the property manager.',
    bookingModalTitle: 'Request Reservation',
    guestNameLabel: 'Full Name',
    guestNamePlaceholder: 'e.g. Mohammed Alami',
    phoneLabel: 'WhatsApp Phone Number',
    phonePlaceholder: '+212 6XX XX XX XX',
    emailLabel: 'Email Address (optional)',
    emailPlaceholder: 'name@example.com',
    checkInLabel: 'Check-in Date',
    checkOutLabel: 'Check-out Date',
    guestsCountLabel: 'Number of Guests',
    messageLabel: 'Additional Message / Inquiries',
    messagePlaceholder: 'Tell us about your arrival time or any special requests...',
    submitInquiry: 'Send Booking Inquiry',
    submitting: 'Submitting...',
    inquirySuccessTitle: 'Booking Request Received!',
    inquirySuccessMsg: 'Thank you for your inquiry. Your request reference number is: ',
    inquirySuccessFollowUp: 'You can also instantly chat with the owner on WhatsApp to confirm availability and finalize your arrival details.',
    chatNowWhatsApp: 'Chat Now on WhatsApp',
    closeBtn: 'Close',
    stayDuration: 'Stay Duration',
    nights: 'nights',
    night: 'night',
    estimatedTotal: 'Estimated Total',
    pricingNote: 'Prices are indicative and subject to seasonal adjustments. No advance online payment is required on this website.',
    galleryTitle: 'Photo & Scenery Gallery',
    gallerySubtitle: 'Explore our apartments, balconies, sunset horizons, and the natural coast of Briech & Asilah.',
    galleryFilterAll: 'All Photos',
    galleryFilterApartments: 'Apartments',
    galleryFilterBalconies: 'Balconies & Sunset',
    galleryFilterBriech: 'Briech & Beaches',
    aboutTitle: 'About Ghorob Chams Residence',
    aboutStoryTitle: 'A Coastal Haven in Northern Morocco',
    aboutP1: 'Nestled along the pristine Atlantic shoreline in the commune of Briech, Ghorob Chams Residence (إقامة غروب شمس) was created to offer travelers, families, and remote workers a quiet, scenic, and authentic coastal stay.',
    aboutP2: 'Located just 10 kilometers north of Asilah, our residence allows guests to easily explore the famous whitewashed medina, renowned murals, cultural festivals, and fresh oceanfront fish restaurants, while returning each evening to the tranquil peacefulness of Briech.',
    aboutP3: 'Every apartment is thoughtfully maintained with comfortable furnishings, functional kitchens, and balconies oriented toward the breathtaking sunset over the Atlantic Ocean.',
    locationTitle: 'Location & How to Reach Us',
    locationSubtitle: 'Conveniently situated in Briech on the coastal route between Tangier and Asilah.',
    gettingThereTitle: 'Getting to Ghorob Chams',
    byCarTitle: 'By Car',
    byCarDesc: 'Take the coastal N1 road or the A5 highway (Exit Asilah North). Briech is approximately 10 minutes drive north of Asilah and 35 minutes south of Tangier.',
    byTrainTitle: 'By Train',
    byTrainDesc: 'The Asilah ONCF train station is 10 km away with regular train connections from Tangier, Casablanca, and Rabat.',
    byAirTitle: 'By Plane',
    byAirDesc: 'Tangier Ibn Battuta International Airport (TNG) is approximately 32 km away (around 30 minutes drive).',
    interactiveMapTitle: 'Interactive Google Maps',
    openGoogleMaps: 'Open in Google Maps App',
    contactTitle: 'Contact & Inquiries',
    contactSubtitle: 'Have a question or looking to plan your holiday? Reach out directly via WhatsApp or message us.',
    directContactTitle: 'Direct Contact Details',
    whatsappTitle: 'WhatsApp Inquiries',
    whatsappSubtitle: 'Fastest response for availability & bookings',
    locationAddressTitle: 'Address',
    openingHoursTitle: 'Reception & Inquiries',
    openingHoursValue: 'Every day: 08:30 – 21:00 (GMT+1)',
    sendMessageTitle: 'Send a Message',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    allRightsReserved: 'All rights reserved.',
    footerNotice: 'Ghorob Chams Residence is a private furnished holiday rental located in Briech, Morocco. We value your privacy and communicate directly with our guests.',
    adminTitle: 'Property Management Dashboard',
    adminLoginTitle: 'Owner & Manager Login',
    adminPasswordLabel: 'Admin Password',
    adminLoginBtn: 'Log In to Dashboard',
    adminLogoutBtn: 'Log Out',
    adminTabApartments: 'Manage Apartments',
    adminTabInquiries: 'Booking Inquiries',
    adminTabSettings: 'Website & Contact Settings',
    addNewApartment: 'Add New Apartment',
    editApartment: 'Edit Apartment',
    deleteApartment: 'Delete',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    statusUpdated: 'Status updated successfully',
    inquiryStatusNew: 'New',
    inquiryStatusContacted: 'Contacted',
    inquiryStatusConfirmed: 'Confirmed',
    inquiryStatusCancelled: 'Cancelled',
    actionWhatsAppGuest: 'WhatsApp Guest',
    noInquiriesYet: 'No booking inquiries received yet.',
    whatsappNumberConfigLabel: 'WhatsApp Reservation Number (digits only, e.g. 212638194995)',
    contactPhoneLabel: 'Public Contact Phone',
    contactEmailLabel: 'Public Contact Email',
    saveSettingsBtn: 'Update Website Settings',
    settingsSavedSuccess: 'Settings saved successfully',
    transparentNotice: 'Notice: Real booking dates and final rates are confirmed directly via our verified WhatsApp channel.'
  },

  fr: {
    brandName: 'Résidence Ghorob Chams',
    brandNameAr: 'إقامة غروب شمس',
    tagline: 'Votre Séjour Côtier Paisible à Briech, Maroc',
    subTagline: 'Appartements meublés près de la mer, à 10 km d’Assilah',
    navHome: 'Accueil',
    navApartments: 'Appartements',
    navAbout: 'À propos',
    navGallery: 'Galerie',
    navLocation: 'Emplacement',
    navContact: 'Contact',
    navAdmin: 'Espace Propriétaire',
    heroHeadline: 'Votre Séjour Côtier Paisible à Briech, Maroc',
    heroSubtitle: 'Appartements de vacances meublés face à l’océan, à 10 km d’Assilah. Brise marine, couchers de soleil dorés et hospitalité authentique du Nord.',
    btnExplore: 'Découvrir les Appartements',
    btnBookStay: 'Réserver Votre Séjour',
    btnContactUs: 'Nous Contacter',
    btnWhatsAppDirect: 'Réservation WhatsApp',
    btnViewDetails: 'Voir l’Appartement',
    btnRequestBooking: 'Demander une Réservation',
    btnInquireWhatsApp: 'Demande via WhatsApp',
    whyTitle: 'Pourquoi Choisir la Résidence Ghorob Chams',
    whySubtitle: 'Un havre de paix côtier entre les vagues de l’Atlantique et la médina artistique d’Assilah',
    whyReason1Title: 'À Deux Pas des Plages Atlantiques',
    whyReason1Desc: 'Briech offre de vastes plages préservées et une brise océanique revigorante, loin du tumulte urbain.',
    whyReason2Title: 'À 10 km de la Médina d’Assilah',
    whyReason2Desc: 'Accédez en 10 minutes aux ruelles blanches d’Assilah, à ses fresques murales célèbres et ses restaurants de poissons.',
    whyReason3Title: 'Entièrement Meublés & Équipés',
    whyReason3Desc: 'Cuisine équipée, balcons avec vue sur le coucher de soleil, literie confortable et espaces de vie familiaux.',
    whyReason4Title: 'Accueil Direct & Tranquillité',
    whyReason4Desc: 'Accueil personnalisé, tarifs clairs, calme résidentiel et réactivité directe via WhatsApp.',
    distanceAsilah: '10 km de la Médina d’Assilah',
    distanceAirport: '32 km de l’Aéroport de Tanger',
    distanceBeach: 'Accès rapide à la plage de Briech',
    distanceTangierMed: '65 km du Port Tanger Med',
    featuredTitle: 'Appartements de Vacances Disponibles',
    featuredSubtitle: 'Choisissez votre cocon côtier. Caractéristiques précises, équipements complets et vue coucher de soleil.',
    filterAll: 'Tous les Appartements',
    filterSeaView: 'Vue Mer Uniquement',
    filterBedrooms: 'Chambres',
    filterAnyBedrooms: 'Toutes',
    filterGuests: 'Voyageurs',
    filterAnyGuests: 'Tous',
    priceNight: '/ nuit',
    priceMonth: '/ mois',
    fromPrice: 'À partir de',
    furnishedStatus: 'Meublé',
    unfurnishedStatus: 'Non meublé',
    seaViewLabel: 'Vue Mer',
    balconyLabel: 'Balcon Privatif',
    bedroomsLabel: 'Chambres',
    bathroomsLabel: 'Salles de bain',
    guestsMax: 'Capacité max',
    areaLabel: 'Superficie',
    floorLabel: 'Étage',
    statusAvailable: 'Disponible',
    statusReserved: 'Réservé',
    statusMaintenance: 'En maintenance',
    demoNoticeBadge: 'Contenu de démonstration',
    demoNoticeExplanation: 'Ce logement est une annonce de démonstration pour visualiser le site. Les disponibilités et tarifs réels sont confirmés avec le gestionnaire.',
    bookingModalTitle: 'Demande de Réservation',
    guestNameLabel: 'Nom complet',
    guestNamePlaceholder: 'ex. Karim Bennani',
    phoneLabel: 'Numéro WhatsApp',
    phonePlaceholder: '+212 6XX XX XX XX',
    emailLabel: 'Adresse e-mail (facultatif)',
    emailPlaceholder: 'nom@exemple.com',
    checkInLabel: 'Date d’arrivée',
    checkOutLabel: 'Date de départ',
    guestsCountLabel: 'Nombre de personnes',
    messageLabel: 'Message ou précisions',
    messagePlaceholder: 'Heure approximative d’arrivée ou demandes particulières...',
    submitInquiry: 'Envoyer la Demande',
    submitting: 'Envoi en cours...',
    inquirySuccessTitle: 'Demande de Réservation Envoyée !',
    inquirySuccessMsg: 'Merci pour votre demande. Votre numéro de référence est : ',
    inquirySuccessFollowUp: 'Vous pouvez également échanger immédiatement avec le propriétaire sur WhatsApp pour finaliser les détails.',
    chatNowWhatsApp: 'Discuter sur WhatsApp',
    closeBtn: 'Fermer',
    stayDuration: 'Durée du séjour',
    nights: 'nuits',
    night: 'nuit',
    estimatedTotal: 'Estimation Totale',
    pricingNote: 'Les tarifs sont indicatifs et varient selon la saison. Aucun paiement en ligne préalable n’est requis sur ce site.',
    galleryTitle: 'Galerie Photos & Paysages',
    gallerySubtitle: 'Découvrez nos appartements, terrasses, couchers de soleil et la côte naturelle de Briech et Assilah.',
    galleryFilterAll: 'Toutes les Photos',
    galleryFilterApartments: 'Appartements',
    galleryFilterBalconies: 'Balcons & Coucher de Soleil',
    galleryFilterBriech: 'Briech & Plages',
    aboutTitle: 'À Propos de la Résidence Ghorob Chams',
    aboutStoryTitle: 'Un Refuge Côtier dans le Nord du Maroc',
    aboutP1: 'Nichée le long du littoral atlantique dans la commune de Briech, la Résidence Ghorob Chams (إقامة غروب شمس) a été pensée pour offrir aux voyageurs et aux familles un séjour reposant, authentique et proche de la nature.',
    aboutP2: 'Située à seulement 10 km au nord d’Assilah, notre résidence permet de profiter du charme artistique de la médina blanche et de ses remparts, tout en retrouvant chaque soir le calme et la sérénité de Briech.',
    aboutP3: 'Chaque appartement dispose d’aménagements confortables, d’une cuisine fonctionnelle et de balcons orientés vers les magnifiques couchers de soleil atlantiques.',
    locationTitle: 'Emplacement & Accès',
    locationSubtitle: 'Idéalement située à Briech, sur l’axe côtier entre Tanger et Assilah.',
    gettingThereTitle: 'Comment Venir',
    byCarTitle: 'En Voiture',
    byCarDesc: 'Par la route côtière N1 ou l’autoroute A5 (Sortie Assilah Nord). Briech se trouve à environ 10 minutes d’Assilah et 35 minutes de Tanger.',
    byTrainTitle: 'En Train',
    byTrainDesc: 'Gare ONCF d’Assilah à 10 km, avec liaisons directes quotidiennes depuis Tanger, Rabat et Casablanca.',
    byAirTitle: 'En Avion',
    byAirDesc: 'Aéroport international de Tanger Ibn Battouta (TNG) à environ 32 km (environ 30 minutes de trajet).',
    interactiveMapTitle: 'Plan Google Maps Interactif',
    openGoogleMaps: 'Ouvrir dans l’application Google Maps',
    contactTitle: 'Contact & Renseignements',
    contactSubtitle: 'Une question ou un projet de séjour ? Contactez directement le propriétaire par WhatsApp ou message.',
    directContactTitle: 'Coordonnées Directes',
    whatsappTitle: 'Échanges WhatsApp',
    whatsappSubtitle: 'Réponse rapide pour disponibilités et réservations',
    locationAddressTitle: 'Adresse',
    openingHoursTitle: 'Horaires d’Accueil',
    openingHoursValue: 'Tous les jours : 08h30 – 21h00 (GMT+1)',
    sendMessageTitle: 'Envoyer un Message',
    privacyPolicy: 'Politique de Confidentialité',
    termsConditions: 'Conditions Générales',
    allRightsReserved: 'Tous droits réservés.',
    footerNotice: 'La Résidence Ghorob Chams propose des locations meublées saisonnières à Briech. Nous respectons votre vie privée et favorisons un contact direct et transparent.',
    adminTitle: 'Tableau de Bord Propriétaire',
    adminLoginTitle: 'Connexion Espace Gestion',
    adminPasswordLabel: 'Mot de passe administrateur',
    adminLoginBtn: 'Se Connecter',
    adminLogoutBtn: 'Déconnexion',
    adminTabApartments: 'Gérer les Appartements',
    adminTabInquiries: 'Demandes de Réservation',
    adminTabSettings: 'Paramètres du Site & Contact',
    addNewApartment: 'Ajouter un Appartement',
    editApartment: 'Modifier',
    deleteApartment: 'Supprimer',
    saveChanges: 'Enregistrer les Modifications',
    cancel: 'Annuler',
    statusUpdated: 'Statut mis à jour avec succès',
    inquiryStatusNew: 'Nouveau',
    inquiryStatusContacted: 'Contacté',
    inquiryStatusConfirmed: 'Confirmé',
    inquiryStatusCancelled: 'Annulé',
    actionWhatsAppGuest: 'Contacter sur WhatsApp',
    noInquiriesYet: 'Aucune demande reçue pour le moment.',
    whatsappNumberConfigLabel: 'Numéro WhatsApp de réservation (chiffres uniquement, ex. 212638194995)',
    contactPhoneLabel: 'Téléphone public',
    contactEmailLabel: 'E-mail public',
    saveSettingsBtn: 'Enregistrer les Paramètres',
    settingsSavedSuccess: 'Paramètres enregistrés avec succès',
    transparentNotice: 'Avis : Les dates réelles et tarifs finaux sont confirmés directement via notre contact WhatsApp officiel.'
  },

  ar: {
    brandName: 'إقامة غروب شمس',
    brandNameAr: 'Ghorob Chams Residence',
    tagline: 'إقامتكم الساحلية الهادئة في بريش، المغرب',
    subTagline: 'شقق مفروشة قرب البحر، على بعد 10 كلم فقط من أصيلة',
    navHome: 'الرئيسية',
    navApartments: 'الشقق',
    navAbout: 'عن الإقامة',
    navGallery: 'معرض الصور',
    navLocation: 'الموقع',
    navContact: 'اتصل بنا',
    navAdmin: 'بوابة المالك',
    heroHeadline: 'إقامتكم الساحلية الهادئة في بريش، المغرب',
    heroSubtitle: 'شقق عطلات مفروشة ومجهزة بالكامل قرب البحر، على بعد 10 كلم فقط من أصيلة. نسيم الأطلسي، إطلالات ساحرة على غروب الشمس، وضيافة مغربية أصيلة.',
    btnExplore: 'استكشف الشقق',
    btnBookStay: 'احجز إقامتك',
    btnContactUs: 'اتصل بنا',
    btnWhatsAppDirect: 'حجز فوري عبر واتساب',
    btnViewDetails: 'تفاصيل الشقة',
    btnRequestBooking: 'طلب حجز',
    btnInquireWhatsApp: 'استفسار عبر واتساب',
    whyTitle: 'لماذا تختار إقامة غروب شمس؟',
    whySubtitle: 'ملاذ ساحلي هادئ يجمع بين سكون شواطئ بريش وقرب مدينة أصيلة التاريخية الفاتنة',
    whyReason1Title: 'خطوات قليلة عن شواطئ الأطلسي',
    whyReason1Desc: 'تتميز بريش بشواطئ رملية نقية وهادئة بعيداً عن صخب المدن وازدحامها.',
    whyReason2Title: '10 كلم فقط عن أصيلة التاريخية',
    whyReason2Desc: 'وصول سهل في 10 دقائق إلى أزقة أصيلة البيضاء، الجداريات الفنية الشهيرة، ومطاعم الأسماك الطازجة.',
    whyReason3Title: 'شقق مفروشة ومجهزة بالكامل',
    whyReason3Desc: 'مطابخ متكاملة، شرفات مطلة على البحر والغروب، أسرّة مريحة، وأجواء عائلية آمنة.',
    whyReason4Title: 'تعامل مباشر واهتمام شخصي',
    whyReason4Desc: 'استقبال شخصي، شفافية تامة في الأسعار، هدوء سكني، وتواصل سريع ومباشر عبر واتساب.',
    distanceAsilah: '10 كلم عن مدينة أصيلة',
    distanceAirport: '32 كلم عن مطار طنجة ابن بطوطة',
    distanceBeach: 'خطوات مشياً إلى شاطئ بريش',
    distanceTangierMed: '65 كلم عن ميناء طنجة المتوسط',
    featuredTitle: 'شقق العطلات المتاحة',
    featuredSubtitle: 'اختر شقتك الساحلية المثالية. مواصفات دقيقة، تجهيزات عصرية وإطلالة على البحر.',
    filterAll: 'جميع الشقق',
    filterSeaView: 'إطلالة بحرية فقط',
    filterBedrooms: 'الغرف',
    filterAnyBedrooms: 'أي عدد',
    filterGuests: 'الضيوف',
    filterAnyGuests: 'أي عدد',
    priceNight: '/ ليلة',
    priceMonth: '/ شهر',
    fromPrice: 'ابتداءً من',
    furnishedStatus: 'مفروشة',
    unfurnishedStatus: 'غير مفروشة',
    seaViewLabel: 'إطلالة على البحر',
    balconyLabel: 'شرفة خاصة',
    bedroomsLabel: 'غرف النوم',
    bathroomsLabel: 'الحمامات',
    guestsMax: 'أقصى عدد ضيوف',
    areaLabel: 'المساحة',
    floorLabel: 'الطابق',
    statusAvailable: 'متاحة',
    statusReserved: 'محجوزة',
    statusMaintenance: 'تحت الصيانة',
    demoNoticeBadge: 'نموذج توضيحي',
    demoNoticeExplanation: 'هذه الشقة نموذج استعراضي لمعاينة الموقع. التوفر الفعلي والأسعار النهائية يتم تأكيدها مباشرة مع المالك.',
    bookingModalTitle: 'طلب حجز شقة',
    guestNameLabel: 'الاسم الكامل',
    guestNamePlaceholder: 'مثال: محمد العلمي',
    phoneLabel: 'رقم هاتف الواتساب',
    phonePlaceholder: '+212 6XX XX XX XX',
    emailLabel: 'البريد الإلكتروني (اختياري)',
    emailPlaceholder: 'name@example.com',
    checkInLabel: 'تاريخ الوصول',
    checkOutLabel: 'تاريخ المغادرة',
    guestsCountLabel: 'عدد الضيوف',
    messageLabel: 'رسالة إضافية أو استفسار',
    messagePlaceholder: 'يرجى إعلامنا بموعد الوصول التقريبي أو أي طلبات خاصة...',
    submitInquiry: 'إرسال طلب الحجز',
    submitting: 'جاري الإرسال...',
    inquirySuccessTitle: 'تم استلام طلبكم بنجاح!',
    inquirySuccessMsg: 'شكراً لاهتمامكم بإقامة غروب شمس. رقم مرجع طلبكم هو: ',
    inquirySuccessFollowUp: 'يمكنكم أيضاً مراسلة المالك مباشرة عبر واتساب لتأكيد التوفر ومناقشة تفاصيل وصولكم فوراً.',
    chatNowWhatsApp: 'مراسلة عبر واتساب الآن',
    closeBtn: 'إغلاق',
    stayDuration: 'مدة الإقامة',
    nights: 'ليالٍ',
    night: 'ليلة',
    estimatedTotal: 'المجموع التقديري',
    pricingNote: 'الأسعار تقريبية وتخضع للمواسم السياحية. لا يُطلب أي دفع إلكتروني مسبق عبر هذا الموقع.',
    galleryTitle: 'معرض الصور والمناظر الطبيعية',
    gallerySubtitle: 'استكشف صور الإقامة، الشرفات، لحظات الغروب، وساحل بريش وأصيلة.',
    galleryFilterAll: 'جميع الصور',
    galleryFilterApartments: 'الشقق',
    galleryFilterBalconies: 'الشرفات والغروب',
    galleryFilterBriech: 'بريش والشواطئ',
    aboutTitle: 'عن إقامة غروب شمس',
    aboutStoryTitle: 'ملاذ ساحلي مريح في شمال المغرب',
    aboutP1: 'تقع إقامة غروب شمس على الساحل الأطلسي الخلاب في جماعة بريش، وقد تم تصميمها لتوفير إقامة مريحة وهادئة للعائلات والمسافرين الباحثين عن الراحة والأصالة بالقرب من البحر.',
    aboutP2: 'على بعد 10 كيلومترات فقط شمال مدينة أصيلة الفنية، تتيح الإقامة لضيوفها التمتع بزيارة المدينة العتيقة وجدارياتها الشهيرة ومطاعم الأسماك، والعودة كل مساء إلى هدوء وسكينة بريش.',
    aboutP3: 'تتميز جميع الشقق بأثاث مريح، مطابخ مجهزة، وشرفات مطلة على مشهد غروب الشمس الرائع فوق المحيط الأطلسي.',
    locationTitle: 'الموقع والوصول',
    locationSubtitle: 'موقع استراتيجي في بريش على الطريق الساحلي الرابط بين طنجة وأصيلة.',
    gettingThereTitle: 'كيفية الوصول إلى الإقامة',
    byCarTitle: 'بالسيارة',
    byCarDesc: 'عبر الطريق الوطنية الساحلية N1 أو الطريق السيار A5 (مخرج أصيلة شمال). تقع بريش على بعد حوالي 10 دقائق شمال أصيلة و35 دقيقة جنوب طنجة.',
    byTrainTitle: 'بالقطار',
    byTrainDesc: 'محطة قطار أصيلة تبعد 10 كلم، مع رحلات قطار منتظمة من وإلى طنجة، الرباط، والدار البيضاء.',
    byAirTitle: 'بالطائرة',
    byAirDesc: 'مطار طنجة ابن بطوطة الدولي يبعد حوالي 32 كلم (حوالي 30 دقيقة بالسيارة).',
    interactiveMapTitle: 'خريطة جوجل التفاعلية',
    openGoogleMaps: 'فتح في تطبيق خرائط Google',
    contactTitle: 'الاتصال والاستفسار',
    contactSubtitle: 'هل لديكم أي سؤال أو تخططون لإقامتكم؟ تواصلوا معنا مباشرة عبر واتساب أو أرسلوا رسالة.',
    directContactTitle: 'معلومات الاتصال المباشرة',
    whatsappTitle: 'التواصل عبر واتساب',
    whatsappSubtitle: 'الرد الأسرع للحجوزات وتأكيد التوفر',
    locationAddressTitle: 'العنوان',
    openingHoursTitle: 'أوقات الاستقبال والرد',
    openingHoursValue: 'يومياً: من 08:30 صباحاً إلى 21:00 مساءً',
    sendMessageTitle: 'أرسل لنا رسالة',
    privacyPolicy: 'سياسة الخصوصية',
    termsConditions: 'الشروط والأحكام',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    footerNotice: 'إقامة غروب شمس هي إقامة شقق عطلات مفروشة في بريش، المغرب. نحن نحترم خصوصيتكم ونفضل التواصل المباشر والصادق.',
    adminTitle: 'لوحة إدارة الإقامة',
    adminLoginTitle: 'تسجيل دخول المالك والمدير',
    adminPasswordLabel: 'كلمة مرور الإدارة',
    adminLoginBtn: 'تسجيل الدخول',
    adminLogoutBtn: 'تسجيل الخروج',
    adminTabApartments: 'إدارة الشقق',
    adminTabInquiries: 'طلبات الحجز',
    adminTabSettings: 'إعدادات الموقع ومعلومات الاتصال',
    addNewApartment: 'إضافة شقة جديدة',
    editApartment: 'تعديل',
    deleteApartment: 'حذف',
    saveChanges: 'حفظ التغييرات',
    cancel: 'إلغاء',
    statusUpdated: 'تم تحديث الحالة بنجاح',
    inquiryStatusNew: 'جديد',
    inquiryStatusContacted: 'تم التواصل',
    inquiryStatusConfirmed: 'مؤكد',
    inquiryStatusCancelled: 'ملغى',
    actionWhatsAppGuest: 'مراسلة الضيف عبر واتساب',
    noInquiriesYet: 'لا توجد طلبات حجز بعد.',
    whatsappNumberConfigLabel: 'رقم واتساب الحجوزات (أرقام فقط، مثال: 212638194995)',
    contactPhoneLabel: 'هاتف الاتصال العام',
    contactEmailLabel: 'البريد الإلكتروني العام',
    saveSettingsBtn: 'حفظ إعدادات الموقع',
    settingsSavedSuccess: 'تم حفظ الإعدادات بنجاح',
    transparentNotice: 'ملاحظة: التواريخ الفعلية والأسعار النهائية يتم تأكيدها مباشرة عبر قناة الواتساب الرسمية المعتمدة.'
  },

  es: {
    brandName: 'Residencia Ghorob Chams',
    brandNameAr: 'إقامة غروب شمس',
    tagline: 'Su Estancia Costera y Tranquila en Briech, Marruecos',
    subTagline: 'Apartamentos amueblados cerca del mar, a solo 10 km de Arcila (Asilah)',
    navHome: 'Inicio',
    navApartments: 'Apartamentos',
    navAbout: 'Sobre Nosotros',
    navGallery: 'Galería',
    navLocation: 'Ubicación',
    navContact: 'Contacto',
    navAdmin: 'Portal Propietario',
    heroHeadline: 'Su Estancia Costera y Tranquila en Briech, Marruecos',
    heroSubtitle: 'Apartamentos vacacionales amueblados frente al océano, a solo 10 km de Arcila. Brisas atlánticas, atardeceres dorados y auténtica hospitalidad del norte de Marruecos.',
    btnExplore: 'Explorar Apartamentos',
    btnBookStay: 'Reservar Estancia',
    btnContactUs: 'Contáctenos',
    btnWhatsAppDirect: 'Reserva por WhatsApp',
    btnViewDetails: 'Ver Apartamento',
    btnRequestBooking: 'Solicitar Reserva',
    btnInquireWhatsApp: 'Consultar por WhatsApp',
    whyTitle: 'Por Qué Elegir Residencia Ghorob Chams',
    whySubtitle: 'Un refugio tranquilo junto al mar entre las olas del Atlántico y la histórica medina artística de Arcila',
    whyReason1Title: 'A Pasos de las Playas Atlánticas',
    whyReason1Desc: 'Briech ofrece amplias playas de arena virgen y una brisa marina relajante, lejos del bullicio urbano.',
    whyReason2Title: 'A 10 km de la Histórica Arcila',
    whyReason2Desc: 'Acceso en 10 minutos a las famosas murallas blancas de Arcila, sus murales de arte y restaurantes de mariscos.',
    whyReason3Title: 'Totalmente Amueblados y Equipados',
    whyReason3Desc: 'Cocinas modernas, terrazas privadas con vista a la puesta de sol, camas confortables y espacios familiares.',
    whyReason4Title: 'Atención Directa y Privacidad',
    whyReason4Desc: 'Atención personalizada del anfitrión, precios transparentes, ambiente residencial tranquilo y respuesta rápida por WhatsApp.',
    distanceAsilah: '10 km a la Medina de Arcila',
    distanceAirport: '32 km al Aeropuerto de Tánger',
    distanceBeach: 'A pocos pasos de la playa de Briech',
    distanceTangierMed: '65 km al Puerto Tánger Med',
    featuredTitle: 'Apartamentos Vacacionales Disponibles',
    featuredSubtitle: 'Elija su refugio costero. Especificaciones claras, comodidades completas y serenas vistas al atardecer.',
    filterAll: 'Todos los Apartamentos',
    filterSeaView: 'Solo Vista al Mar',
    filterBedrooms: 'Dormitorios',
    filterAnyBedrooms: 'Cualquiera',
    filterGuests: 'Huéspedes',
    filterAnyGuests: 'Cualquiera',
    priceNight: '/ noche',
    priceMonth: '/ mes',
    fromPrice: 'Desde',
    furnishedStatus: 'Amueblado',
    unfurnishedStatus: 'Sin amueblar',
    seaViewLabel: 'Vista al Mar',
    balconyLabel: 'Balcón Privado',
    bedroomsLabel: 'Dormitorios',
    bathroomsLabel: 'Baños',
    guestsMax: 'Máx. Huéspedes',
    areaLabel: 'Superficie',
    floorLabel: 'Planta',
    statusAvailable: 'Disponible',
    statusReserved: 'Reservado',
    statusMaintenance: 'En mantenimiento',
    demoNoticeBadge: 'Aviso de Contenido Demo',
    demoNoticeExplanation: 'Este alojamiento es una muestra de demostración para previsualizar el sitio. Las fechas y tarifas reales se confirman directamente con el propietario.',
    bookingModalTitle: 'Solicitud de Reserva',
    guestNameLabel: 'Nombre Completo',
    guestNamePlaceholder: 'ej. Carlos Ruiz',
    phoneLabel: 'Teléfono / WhatsApp',
    phonePlaceholder: '+34 6XX XX XX XX',
    emailLabel: 'Correo Electrónico (opcional)',
    emailPlaceholder: 'nombre@ejemplo.com',
    checkInLabel: 'Fecha de Llegada',
    checkOutLabel: 'Fecha de Salida',
    guestsCountLabel: 'Número de Personas',
    messageLabel: 'Mensaje o Peticiones Especiales',
    messagePlaceholder: 'Indíquenos hora aproximada de llegada o cualquier necesidad...',
    submitInquiry: 'Enviar Solicitud',
    submitting: 'Enviando...',
    inquirySuccessTitle: '¡Solicitud Recibida!',
    inquirySuccessMsg: 'Gracias por su solicitud. Su número de referencia es: ',
    inquirySuccessFollowUp: 'También puede chatear de inmediato con el propietario en WhatsApp para verificar disponibilidad y ultimar su llegada.',
    chatNowWhatsApp: 'Chatear en WhatsApp',
    closeBtn: 'Cerrar',
    stayDuration: 'Duración de Estancia',
    nights: 'noches',
    night: 'noche',
    estimatedTotal: 'Total Estimado',
    pricingNote: 'Los precios son indicativos y pueden variar según la temporada. No se requiere ningún pago en línea en este sitio.',
    galleryTitle: 'Galería de Fotos y Paisajes',
    gallerySubtitle: 'Descubra nuestros apartamentos, terrazas, puestas de sol y la naturaleza costera de Briech y Arcila.',
    galleryFilterAll: 'Todas las Fotos',
    galleryFilterApartments: 'Apartamentos',
    galleryFilterBalconies: 'Balcones y Atardecer',
    galleryFilterBriech: 'Briech y Playas',
    aboutTitle: 'Sobre Residencia Ghorob Chams',
    aboutStoryTitle: 'Un Remanso Costero en el Norte de Marruecos',
    aboutP1: 'Ubicada a lo largo de la costa atlántica en la comuna de Briech, la Residencia Ghorob Chams (إقامة غروب شمس) fue creada para ofrecer a viajeros, parejas y familias una estancia costera tranquila, pintoresca y auténtica.',
    aboutP2: 'Situada a solo 10 km al norte de Arcila, nuestra residencia permite explorar fácilmente la famosa medina blanca, sus coloridos murales y restaurantes de marisco, regresando cada tarde a la serenidad de Briech.',
    aboutP3: 'Cada apartamento cuenta con comodidades completas, cocinas funcionales y terrazas orientadas hacia el espectacular atardecer del océano Atlántico.',
    locationTitle: 'Ubicación y Cómo Llegar',
    locationSubtitle: 'Estratégicamente ubicada en Briech, sobre la ruta costera entre Tánger y Arcila.',
    gettingThereTitle: 'Cómo Llegar a Ghorob Chams',
    byCarTitle: 'En Coche',
    byCarDesc: 'Por la carretera costera N1 o autopista A5 (Salida Arcila Norte). Briech está a 10 minutos al norte de Arcila y 35 minutos de Tánger.',
    byTrainTitle: 'En Tren',
    byTrainDesc: 'Estación de tren ONCF de Arcila a 10 km, con conexiones regulares a Tánger, Rabat y Casablanca.',
    byAirTitle: 'En Avión',
    byAirDesc: 'Aeropuerto Internacional de Tánger Ibn Battouta (TNG) a unos 32 km (aprox. 30 minutos en coche).',
    interactiveMapTitle: 'Mapa Interactivo de Google Maps',
    openGoogleMaps: 'Abrir en la aplicación Google Maps',
    contactTitle: 'Contacto y Consultas',
    contactSubtitle: '¿Tiene preguntas o planea sus vacaciones? Contáctenos directamente por WhatsApp o formulario.',
    directContactTitle: 'Datos de Contacto Directo',
    whatsappTitle: 'Atención por WhatsApp',
    whatsappSubtitle: 'Respuesta más rápida para reservas y dudas',
    locationAddressTitle: 'Dirección',
    openingHoursTitle: 'Horario de Atención',
    openingHoursValue: 'Todos los días: 08:30 – 21:00 (GMT+1)',
    sendMessageTitle: 'Enviar un Mensaje',
    privacyPolicy: 'Política de Privacidad',
    termsConditions: 'Términos y Condiciones',
    allRightsReserved: 'Todos los derechos reservados.',
    footerNotice: 'La Residencia Ghorob Chams ofrece alquileres vacacionales amueblados en Briech. Cuidamos su privacidad con trato directo y sincero.',
    adminTitle: 'Panel de Gestión del Propietario',
    adminLoginTitle: 'Acceso para Propietarios',
    adminPasswordLabel: 'Contraseña de Administrador',
    adminLoginBtn: 'Iniciar Sesión',
    adminLogoutBtn: 'Cerrar Sesión',
    adminTabApartments: 'Gestionar Apartamentos',
    adminTabInquiries: 'Solicitudes de Reserva',
    adminTabSettings: 'Ajustes del Sitio y Contacto',
    addNewApartment: 'Añadir Apartamento',
    editApartment: 'Editar',
    deleteApartment: 'Eliminar',
    saveChanges: 'Guardar Cambios',
    cancel: 'Cancelar',
    statusUpdated: 'Estado actualizado correctamente',
    inquiryStatusNew: 'Nuevo',
    inquiryStatusContacted: 'Contactado',
    inquiryStatusConfirmed: 'Confirmado',
    inquiryStatusCancelled: 'Cancelado',
    actionWhatsAppGuest: 'Escribir por WhatsApp',
    noInquiriesYet: 'No hay solicitudes de reserva todavía.',
    whatsappNumberConfigLabel: 'Número de WhatsApp para reservas (solo dígitos, ej. 212638194995)',
    contactPhoneLabel: 'Teléfono público',
    contactEmailLabel: 'Correo público',
    saveSettingsBtn: 'Guardar Ajustes',
    settingsSavedSuccess: 'Ajustes guardados con éxito',
    transparentNotice: 'Aviso: Las fechas y precios definitivos se confirman directamente mediante nuestro canal oficial de WhatsApp.'
  },

  de: {
    brandName: 'Residenz Ghorob Chams',
    brandNameAr: 'إقامة غروب شمس',
    tagline: 'Ihr ruhiger Küstenurlaub in Briech, Marokko',
    subTagline: 'Möblierte Ferienwohnungen in Meeresnähe, nur 10 km von Asilah entfernt',
    navHome: 'Startseite',
    navApartments: 'Ferienwohnungen',
    navAbout: 'Über uns',
    navGallery: 'Galerie',
    navLocation: 'Lage & Anreise',
    navContact: 'Kontakt',
    navAdmin: 'Vermieter-Portal',
    heroHeadline: 'Ihr ruhiger Küstenurlaub in Briech, Marokko',
    heroSubtitle: 'Möblierte Ferienwohnungen am Meer, nur 10 km von Asilah entfernt. Atlantikbrise, goldene Sonnenuntergänge und authentische nordmarokkanische Gastfreundschaft.',
    btnExplore: 'Wohnungen entdecken',
    btnBookStay: 'Aufenthalt buchen',
    btnContactUs: 'Kontakt aufnehmen',
    btnWhatsAppDirect: 'WhatsApp-Reservierung',
    btnViewDetails: 'Wohnung ansehen',
    btnRequestBooking: 'Buchung anfragen',
    btnInquireWhatsApp: 'Per WhatsApp anfragen',
    whyTitle: 'Warum Residenz Ghorob Chams wählen',
    whySubtitle: 'Eine friedliche Oase am Meer zwischen den Wellen des Atlantiks und der historischen Künstlerstadt Asilah',
    whyReason1Title: 'Nur wenige Schritte zum Atlantikstrand',
    whyReason1Desc: 'Briech bietet weite, unberührte Sandstrände und erholsame Meeresluft abseits des Stadtlärms.',
    whyReason2Title: '10 km zum historischen Asilah',
    whyReason2Desc: 'In 10 Minuten erreichen Sie die weiß getünchte Medina von Asilah mit Wandmalereien und Fischrestaurants.',
    whyReason3Title: 'Voll möbliert und ausgestattet',
    whyReason3Desc: 'Moderne Küchen, private Balkone mit Sonnenuntergangsblick, bequeme Betten und familienfreundliche Räume.',
    whyReason4Title: 'Direkter Vermieterkontakt & Ruhe',
    whyReason4Desc: 'Persönlicher Empfang, transparente Preise, ruhige Wohnatmosphäre und schnelle WhatsApp-Kommunikation.',
    distanceAsilah: '10 km zur Medina von Asilah',
    distanceAirport: '32 km zum Flughafen Tanger',
    distanceBeach: 'Kurzer Spaziergang zum Strand',
    distanceTangierMed: '65 km zum Hafen Tanger Med',
    featuredTitle: 'Verfügbare Ferienwohnungen',
    featuredSubtitle: 'Wählen Sie Ihre Wohlfühloase an der Küste. Genaue Ausstattungsdetails und friedlicher Meerblick.',
    filterAll: 'Alle Wohnungen',
    filterSeaView: 'Nur mit Meerblick',
    filterBedrooms: 'Schlafzimmer',
    filterAnyBedrooms: 'Beliebig',
    filterGuests: 'Gäste',
    filterAnyGuests: 'Beliebig',
    priceNight: '/ Nacht',
    priceMonth: '/ Monat',
    fromPrice: 'Ab',
    furnishedStatus: 'Möbliert',
    unfurnishedStatus: 'Unmöbliert',
    seaViewLabel: 'Meerblick',
    balconyLabel: 'Eigener Balkon',
    bedroomsLabel: 'Schlafzimmer',
    bathroomsLabel: 'Badezimmer',
    guestsMax: 'Max. Gäste',
    areaLabel: 'Wohnfläche',
    floorLabel: 'Etage',
    statusAvailable: 'Verfügbar',
    statusReserved: 'Reserviert',
    statusMaintenance: 'Wartung',
    demoNoticeBadge: 'Demo-Hinweis',
    demoNoticeExplanation: 'Dies ist ein Beispieleintrag zur Vorschau der Webseite. Tatsächliche Verfügbarkeiten und Saisonpreise werden direkt mit dem Vermieter bestätigt.',
    bookingModalTitle: 'Buchungsanfrage',
    guestNameLabel: 'Vollständiger Name',
    guestNamePlaceholder: 'z.B. Thomas Weber',
    phoneLabel: 'Telefon- / WhatsApp-Nummer',
    phonePlaceholder: '+49 1XX XXXXXXXX',
    emailLabel: 'E-Mail-Adresse (optional)',
    emailPlaceholder: 'name@beispiel.de',
    checkInLabel: 'Anreisedatum',
    checkOutLabel: 'Abreisedatum',
    guestsCountLabel: 'Anzahl Personen',
    messageLabel: 'Zusätzliche Nachricht / Wünsche',
    messagePlaceholder: 'Geben Sie Ihre voraussichtliche Ankunftszeit oder Wünsche an...',
    submitInquiry: 'Anfrage senden',
    submitting: 'Wird gesendet...',
    inquirySuccessTitle: 'Buchungsanfrage erfolgreich eingegangen!',
    inquirySuccessMsg: 'Vielen Dank für Ihre Anfrage. Ihre Referenznummer lautet: ',
    inquirySuccessFollowUp: 'Sie können sich auch sofort per WhatsApp an den Vermieter wenden, um die Verfügbarkeit direkt abzustimmen.',
    chatNowWhatsApp: 'Jetzt per WhatsApp schreiben',
    closeBtn: 'Schließen',
    stayDuration: 'Aufenthaltsdauer',
    nights: 'Nächte',
    night: 'Nacht',
    estimatedTotal: 'Geschätzter Gesamtpreis',
    pricingNote: 'Preise sind Richtwerte und unterliegen saisonalen Anpassungen. Auf dieser Website ist keine Vorab-Onlinezahlung erforderlich.',
    galleryTitle: 'Foto- & Landschaftsgalerie',
    gallerySubtitle: 'Entdecken Sie unsere Wohnungen, Terrassen, Sonnenuntergänge und die natürliche Küste von Briech und Asilah.',
    galleryFilterAll: 'Alle Fotos',
    galleryFilterApartments: 'Wohnungen',
    galleryFilterBalconies: 'Balkone & Sonnenuntergang',
    galleryFilterBriech: 'Briech & Strände',
    aboutTitle: 'Über Residenz Ghorob Chams',
    aboutStoryTitle: 'Ein Refugium an der nordmarokkanischen Atlantikküste',
    aboutP1: 'Entlang der naturbelassenen Atlantikküste in Briech gelegen, wurde die Residenz Ghorob Chams (إقامة غروب شمس) konzipiert, um Reisenden und Familien einen ruhigen, erholsamen und authentischen Urlaub am Meer zu ermöglichen.',
    aboutP2: 'Nur 10 Kilometer nördlich von Asilah gelegen, können unsere Gäste bequem die berühmte weiße Medina, Kunst-Murales und fangfrische Fischrestaurants erkunden und abends in die absolute Ruhe von Briech zurückkehren.',
    aboutP3: 'Jede Wohnung ist liebevoll eingerichtet, mit zweckmäßigen Küchen und Balkonen, die direkt nach Westen auf den spektakulären Sonnenuntergang über dem Atlantik ausgerichtet sind.',
    locationTitle: 'Lage und Anfahrt',
    locationSubtitle: 'Günstig gelegen in Briech an der Küstenstraße zwischen Tanger und Asilah.',
    gettingThereTitle: 'Anreise zu Ghorob Chams',
    byCarTitle: 'Mit dem Auto',
    byCarDesc: 'Über die Küstenstraße N1 oder Autobahn A5 (Ausfahrt Asilah Nord). Briech liegt 10 Min. nördlich von Asilah und 35 Min. südlich von Tanger.',
    byTrainTitle: 'Mit dem Zug',
    byTrainDesc: 'Der ONCF-Bahnhof Asilah ist 10 km entfernt, mit regelmäßigen Zügen nach Tanger, Rabat und Casablanca.',
    byAirTitle: 'Mit dem Flugzeug',
    byAirDesc: 'Der internationale Flughafen Tanger Ibn Battouta (TNG) liegt ca. 32 km entfernt (ca. 30 Minuten Fahrt).',
    interactiveMapTitle: 'Interaktive Google Maps Karte',
    openGoogleMaps: 'In Google Maps öffnen',
    contactTitle: 'Kontakt & Anfragen',
    contactSubtitle: 'Haben Sie Fragen oder planen Sie Ihren Urlaub? Schreiben Sie uns direkt per WhatsApp oder Formular.',
    directContactTitle: 'Direkte Kontaktdaten',
    whatsappTitle: 'WhatsApp-Kontakt',
    whatsappSubtitle: 'Schnellste Antwort für Verfügbarkeit und Buchung',
    locationAddressTitle: 'Adresse',
    openingHoursTitle: 'Erreichbarkeit',
    openingHoursValue: 'Täglich: 08:30 – 21:00 Uhr (GMT+1)',
    sendMessageTitle: 'Nachricht senden',
    privacyPolicy: 'Datenschutzerklärung',
    termsConditions: 'Allgemeine Bedingungen',
    allRightsReserved: 'Alle Rechte vorbehalten.',
    footerNotice: 'Die Residenz Ghorob Chams bietet möblierte Ferienunterkünfte in Briech, Marokko. Wir schätzen Ihre Privatsphäre und bevorzugen direkten Kontakt.',
    adminTitle: 'Verwaltungs-Dashboard',
    adminLoginTitle: 'Anmeldung für Vermieter',
    adminPasswordLabel: 'Administrator-Passwort',
    adminLoginBtn: 'Anmelden',
    adminLogoutBtn: 'Abmelden',
    adminTabApartments: 'Wohnungen verwalten',
    adminTabInquiries: 'Buchungsanfragen',
    adminTabSettings: 'Webseite- & Kontakteinstellungen',
    addNewApartment: 'Neue Wohnung hinzufügen',
    editApartment: 'Bearbeiten',
    deleteApartment: 'Löschen',
    saveChanges: 'Änderungen speichern',
    cancel: 'Abbrechen',
    statusUpdated: 'Status erfolgreich aktualisiert',
    inquiryStatusNew: 'Neu',
    inquiryStatusContacted: 'Kontaktiert',
    inquiryStatusConfirmed: 'Bestätigt',
    inquiryStatusCancelled: 'Storniert',
    actionWhatsAppGuest: 'Gast per WhatsApp schreiben',
    noInquiriesYet: 'Bislang keine Buchungsanfragen vorhanden.',
    whatsappNumberConfigLabel: 'WhatsApp-Buchungsnummer (nur Ziffern, z.B. 212638194995)',
    contactPhoneLabel: 'Öffentliche Telefonnummer',
    contactEmailLabel: 'Öffentliche E-Mail',
    saveSettingsBtn: 'Einstellungen speichern',
    settingsSavedSuccess: 'Einstellungen erfolgreich gespeichert',
    transparentNotice: 'Hinweis: Endgültige Buchungsdaten und Preise werden direkt über unseren offiziellen WhatsApp-Kanal bestätigt.'
  }
};
