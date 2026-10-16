import { Apartment, SiteSettings } from '../types';

export const initialSettings: SiteSettings = {
  whatsappNumber: '212638194995',
  whatsappDisplay: '+212 638 19 49 95',
  contactPhone: '+212 638 19 49 95',
  contactEmail: 'contact@ghorobchams.ma',
  address: {
    en: 'Coastal Road, Briech (10 km north of Asilah), Tangier-Tetouan-Al Hoceima, Morocco',
    fr: 'Route Côtière, Briech (à 10 km au nord d’Assilah), Tanger-Tétouan-Al Hoceïma, Maroc',
    ar: 'الطريق الساحلية، بريش (10 كلم شمال مدينة أصيلة)، جهة طنجة تطوان الحسيمة، المغرب',
    es: 'Carretera Costera, Briech (a 10 km al norte de Arcila), Tánger-Tetuán-Alhucemas, Marruecos',
    de: 'Küstenstraße, Briech (10 km nördlich von Asilah), Tanger-Tétouan-Al Hoceïma, Marokko'
  },
  briechLocationDetails: {
    en: 'Situated along the Atlantic coastline in Briech. Peaceful retreat 10 minutes drive from Asilah historic medina and 30 minutes from Tangier airport.',
    fr: 'Situé sur le littoral atlantique à Briech. Retraite paisible à 10 minutes en voiture de la médina d’Assilah et 30 minutes de l’aéroport de Tanger.',
    ar: 'موقع مميز على الشريط الساحلي الأطلسي ببريش. ملاذ هادئ على بعد 10 دقائق بالسيارة من مدينة أصيلة و30 دقيقة من مطار طنجة.',
    es: 'Ubicado en la costa atlántica de Briech. Refugio tranquilo a 10 minutos en coche de la medina de Arcila y a 30 minutos del aeropuerto de Tánger.',
    de: 'Gelegen an der Atlantikküste in Briech. Ruhige Oase, 10 Autominuten von der Medina in Asilah und 30 Minuten vom Flughafen Tanger entfernt.'
  },
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Briech%20Morocco&t=&z=14&ie=UTF8&iwloc=&output=embed',
  googleMapsLink: 'https://maps.google.com/?q=35.5398246,-5.9890000',
  checkInTime: '15:00',
  checkOutTime: '11:00',
  minNights: 2,
  currency: 'MAD',
  facebookUrl: 'https://facebook.com/ghorobchamsresidence',
  instagramUrl: 'https://instagram.com/ghorobchamsresidence'
};

export const initialApartments: Apartment[] = [
  {
    id: 'apt-sunset-penthouse-1',
    slug: 'penthouse-sunset-horizon-briech',
    title: {
      en: 'Penthouse Sunset Horizon (2 Bedrooms)',
      fr: 'Penthouse Horizon Couchant (2 Chambres)',
      ar: 'بنثاوس أفق الغروب (غرفتا نوم)',
      es: 'Penthouse Horizonte Puesta de Sol (2 Dormitorios)',
      de: 'Penthouse Sonnenuntergang-Horizont (2 Schlafzimmer)'
    },
    shortDescription: {
      en: 'Panoramic top-floor apartment with a wide sunset balcony facing the Atlantic Ocean.',
      fr: 'Appartement au dernier étage avec grand balcon face au coucher de soleil sur l’Atlantique.',
      ar: 'شقة فاخرة بالطابق العلوي مع شرفة واسعة تطل مباشرة على غروب شمس المحيط الأطلسي.',
      es: 'Ático panorámico con amplia terraza orientada a la puesta de sol sobre el océano Atlántico.',
      de: 'Panoramische Dachgeschosswohnung mit großem Balkon mit Blick auf den Sonnenuntergang über dem Atlantik.'
    },
    description: {
      en: 'A bright, beautifully furnished 2-bedroom penthouse designed for relaxed coastal living in Briech. Features a wide private terrace facing west toward the Atlantic sunset, a sunlit living room with comfortable seating, a fully equipped open kitchen with refrigerator, stovetop, and cookware, plus high-speed WiFi and air conditioning.',
      fr: 'Un magnifique penthouse de 2 chambres meublé avec soin pour un séjour côtier reposant à Briech. Comprend une grande terrasse privative orientée plein ouest face au coucher de soleil sur l’Atlantique, un salon baigné de lumière, une cuisine équipée avec réfrigérateur et plaques, ainsi que le WiFi haut débit et la climatisation.',
      ar: 'بنثاوس مشمس ومفروش بعناية يضم غرفتي نوم ومصمم للاسترخاء الساحلي الهادئ في بريش. يتميز بتراس خاص واسع يتجه غرباً نحو غروب الشمس فوق المحيط الأطلسي، صالون مريح بإنارة طبيعية، مطبخ متكامل التجهيز مع ثلاجة وموقد، بالإضافة إلى إنترنت واي فاي سريع ومكيف هواء.',
      es: 'Un luminoso ático de 2 dormitorios cuidadosamente amueblado para unas vacaciones relajantes en Briech. Cuenta con amplia terraza orientada al atardecer atlántico, salón luminoso con sofás confortables, cocina equipada con nevera y vitrocerámica, además de WiFi de alta velocidad y climatización.',
      de: 'Ein helles, geschmackvoll eingerichtetes Penthouse mit 2 Schlafzimmern für einen erholsamen Küstenurlaub in Briech. Ausgestattet mit großer Westterrasse zum Sonnenuntergang über dem Atlantik, lichtdurchflutetem Wohnzimmer, voll ausgestatteter Küche mit Kühlschrank und Herd sowie Highspeed-WLAN und Klimaanlage.'
    },
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    floor: 3,
    areaM2: 78,
    pricePerNight: 650,
    pricePerMonth: 8500,
    currency: 'MAD',
    furnished: true,
    seaView: true,
    balcony: true,
    amenities: [
      'seaView',
      'balcony',
      'wifi',
      'equippedKitchen',
      'airConditioning',
      'freeParking',
      'washingMachine',
      'smartTv',
      'familyFriendly'
    ],
    features: {
      en: [
        'Unobstructed sunset ocean view from private terrace',
        'Direct coastal access a short walk away',
        'Modern equipped kitchen with dining area',
        'Quiet residential building with secure private parking'
      ],
      fr: [
        'Vue panoramique dégagée sur le coucher de soleil et l’océan',
        'Accès direct aux plages de Briech à quelques minutes à pied',
        'Cuisine contemporaine entièrement équipée',
        'Résidence calme avec stationnement privé sécurisé'
      ],
      ar: [
        'إطلالة بانورامية غير محجوبة على غروب شمس المحيط من الشرفة الخاصة',
        'وصول مباشر إلى شاطئ بريش على بعد خطوات قليلة',
        'مطبخ عصري مجهز بالكامل مع طاولة طعام',
        'إقامة سكنية هادئة مع موقف سيارات خاص ومحروس'
      ],
      es: [
        'Vista despejada al atardecer sobre el océano desde la terraza privada',
        'Acceso directo a las playas vírgenes de Briech a pie',
        'Cocina moderna equipada con comedor',
        'Edificio residencial tranquilo con aparcamiento privado vigilado'
      ],
      de: [
        'Freier Blick auf den Sonnenuntergang über dem Meer von der privaten Terrasse',
        'Direkter Strandzugang in wenigen Gehminuten',
        'Moderne Einbauküche mit Essbereich',
        'Ruhige Wohnanlage mit gesichertem Privatparkplatz'
      ]
    },
    images: [
      '/src/assets/images/hero_sunset_coastal_1792176292926.jpg',
      '/src/assets/images/apartment_sea_view_1792176294057.jpg',
      '/src/assets/images/apartment_bedroom_1792176295110.jpg',
      '/src/assets/images/residence_exterior_sunset_1792176295267.jpg'
    ],
    status: 'available',
    featured: true,
    isDemo: true,
    demoNotice: {
      en: 'Sample demonstration listing. Real seasonal availability & rates are confirmed directly via WhatsApp.',
      fr: 'Annonce de démonstration. Disponibilités et tarifs réels confirmés directement par WhatsApp.',
      ar: 'نموذج توضيحي للاستعراض. التوفر الفعلي والأسعار يتم تأكيدها مباشرة عبر الواتساب.',
      es: 'Muestra de demostración. La disponibilidad y tarifas reales se confirman directamente por WhatsApp.',
      de: 'Beispiel-Eintrag. Verfügbarkeit und Endpreise werden direkt via WhatsApp bestätigt.'
    },
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'apt-coastal-suite-2',
    slug: 'coastal-breeze-suite-briech',
    title: {
      en: 'Coastal Breeze Suite (1 Bedroom)',
      fr: 'Suite Brise Marine (1 Chambre)',
      ar: 'جناح نسيم الشاطئ (غرفة نوم واحدة)',
      es: 'Suite Brisa Marina (1 Dormitorio)',
      de: 'Suite Meeresbrise (1 Schlafzimmer)'
    },
    shortDescription: {
      en: 'Cozy and stylish oceanfront apartment ideal for couples or solo travelers seeking calm.',
      fr: 'Appartement chaleureux et raffiné face à la mer, idéal pour couples ou séjours au calme.',
      ar: 'شقة دافئة وأنيقة مطلة على البحر مثالية للأزواج أو الراغبين في الهدوء والسكينة.',
      es: 'Apartamento acogedor frente al mar, ideal para parejas o personas que buscan tranquilidad.',
      de: 'Gemütliche Ferienwohnung direkt am Meer, ideal für Paare oder Alleinreisende auf der Suche nach Ruhe.'
    },
    description: {
      en: 'A quiet 1-bedroom furnished retreat featuring floor-to-ceiling balcony doors, calming neutral coastal tones, an equipped kitchenette, modern bathroom, and dedicated workspace. Perfect for weekend getaways near Asilah or focused remote work with Atlantic breezes.',
      fr: 'Un cocon meublé d’une chambre avec baies vitrées donnant sur le balcon, décoration soignée aux tons marins, kitchenette équipée, salle d’eau moderne et espace bureau. Idéal pour des escapades de week-end près d’Assilah ou pour le télétravail en bord de mer.',
      ar: 'ملاذ هادئ مفروش بغرفة نوم واحدة مع أبواب شرفة زجاجية ممتدة، ألوان ساحلية مريحة، مطبخ صغير مجهز، حمام عصري ومكتب عمل. مثالية للعطلات القصيرة قرب أصيلة أو العمل عن بعد في أجواء نسيم الأطلسي.',
      es: 'Un acogedor apartamento amueblado de 1 dormitorio con ventanales hacia la terraza, tonos costeros relajantes, cocina funcional, baño moderno y zona de trabajo. Perfecto para escapadas de fin de semana cerca de Arcila o teletrabajo frente al Atlántico.',
      de: 'Ein ruhiges möbliertes Apartment mit 1 Schlafzimmer, raumhohen Balkontüren, beruhigenden maritimen Farbtönen, ausgestatteter Küchenzeile, modernem Bad und Arbeitsplatz. Perfekt für Wochenendtrips nahe Asilah oder Homeoffice am Meer.'
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 3,
    floor: 2,
    areaM2: 52,
    pricePerNight: 450,
    pricePerMonth: 6000,
    currency: 'MAD',
    furnished: true,
    seaView: true,
    balcony: true,
    amenities: [
      'seaView',
      'balcony',
      'wifi',
      'equippedKitchen',
      'airConditioning',
      'freeParking',
      'smartTv'
    ],
    features: {
      en: [
        'Private balcony with morning coffee ocean view',
        '10 minutes drive to Asilah old ramparts and fish port',
        'High-speed WiFi suitable for remote work',
        'Comfortable queen bed with fresh coastal linens'
      ],
      fr: [
        'Balcon privatif avec vue océan pour le café du matin',
        'À 10 minutes des remparts historiques d’Assilah et du port',
        'Connexion WiFi haut débit adaptée au télétravail',
        'Lit queen size confortable avec draps de qualité'
      ],
      ar: [
        'شرفة خاصة بإطلالة بحرية لتناول قهوة الصباح',
        '10 دقائق فقط بالسيارة عن أسوار أصيلة التاريخية والميناء',
        'إنترنت واي فاي سريع مناسب للعمل عن بعد',
        'سرير مريح ومزدوج مع شراشف بيضاء نقية'
      ],
      es: [
        'Balcón privado con vista al mar para el café de la mañana',
        'A 10 minutos de las históricas murallas de Arcila y el puerto pesquero',
        'WiFi de alta velocidad idóneo para teletrabajo',
        'Cama queen size cómoda con sábanas de calidad'
      ],
      de: [
        'Privater Balkon mit Meerblick für den Morgenkaffee',
        '10 Autominuten zu den alten Wehrmauern von Asilah und dem Fischereihafen',
        'Schnelles WLAN, ideal für Remote-Arbeit',
        'Bequemes Queensize-Bett mit frischer Bettwäsche'
      ]
    },
    images: [
      '/src/assets/images/apartment_sea_view_1792176294057.jpg',
      '/src/assets/images/apartment_bedroom_1792176295110.jpg',
      '/src/assets/images/briech_beach_coast_1792176294889.jpg'
    ],
    status: 'available',
    featured: true,
    isDemo: true,
    demoNotice: {
      en: 'Sample demonstration listing. Real seasonal availability & rates are confirmed directly via WhatsApp.',
      fr: 'Annonce de démonstration. Disponibilités et tarifs réels confirmés directement par WhatsApp.',
      ar: 'نموذج توضيحي للاستعراض. التوفر الفعلي والأسعار يتم تأكيدها مباشرة عبر الواتساب.',
      es: 'Muestra de demostración. La disponibilidad y tarifas reales se confirman directamente por WhatsApp.',
      de: 'Beispiel-Eintrag. Verfügbarkeit und Endpreise werden direkt via WhatsApp bestätigt.'
    },
    createdAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'apt-atlantic-family-3',
    slug: 'family-atlantic-haven-briech',
    title: {
      en: 'Family Atlantic Haven (3 Bedrooms)',
      fr: 'Havre Familial Atlantique (3 Chambres)',
      ar: 'ملاذ الأطلسي العائلي (3 غرف نوم)',
      es: 'Refugio Familiar Atlántico (3 Dormitorios)',
      de: 'Atlantik-Familienrefugium (3 Schlafzimmer)'
    },
    shortDescription: {
      en: 'Spacious 3-bedroom family apartment with large dining salon and expansive terrace.',
      fr: 'Grand appartement familial de 3 chambres avec vaste salon marocain et grande terrasse.',
      ar: 'شقة عائلية واسعة تضم 3 غرف نوم وصالون كبير مع شرفة فسيحة للعائلات.',
      es: 'Amplio apartamento familiar de 3 dormitorios con salón acogedor y gran terraza.',
      de: 'Geräumige Familienwohnung mit 3 Schlafzimmern, großem Wohnbereich und sonniger Terrasse.'
    },
    description: {
      en: 'Generous family residence in Briech accommodating up to 6 guests. Features three independent bedrooms, two clean bathrooms, a large Moroccan-contemporary living salon, complete family kitchen, and a peaceful garden and sea-glimpse terrace.',
      fr: 'Résidence familiale spacieuse à Briech pouvant accueillir jusqu’à 6 personnes. Offre trois chambres indépendantes, deux salles de bain, un grand salon mariant confort marocain et touches modernes, une cuisine familiale complète et une terrasse au calme.',
      ar: 'شقة عائلية فسيحة في بريش تتسع لما يصل إلى 6 أشخاص. تضم 3 غرف نوم مستقلة، حمامين نظيفين، صالون مغربي عصري رحب، مطبخ عائلي متكامل، وشرفة هادئة مطلة على الطبيعة ولمحات من البحر.',
      es: 'Generosa vivienda familiar en Briech con capacidad para hasta 6 huéspedes. Dispone de tres dormitorios independientes, dos baños completos, amplio salón contemporáneo, cocina familiar y terraza apacible.',
      de: 'Großzügige Familienresidenz in Briech für bis zu 6 Personen. Bietet 3 separate Schlafzimmer, 2 Badezimmer, einen großen marokkanisch-modernen Salon, eine komplett ausgestattete Familienküche und eine ruhige Terrasse mit Garten- und Meeresblick.'
    },
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    floor: 1,
    areaM2: 110,
    pricePerNight: 850,
    pricePerMonth: 11000,
    currency: 'MAD',
    furnished: true,
    seaView: true,
    balcony: true,
    amenities: [
      'seaView',
      'balcony',
      'wifi',
      'equippedKitchen',
      'airConditioning',
      'freeParking',
      'washingMachine',
      'smartTv',
      'familyFriendly'
    ],
    features: {
      en: [
        'Spacious 110 m² layout ideal for family vacations',
        '2 full bathrooms with hot water and modern fixtures',
        'Ground-level easy access with private parking spot',
        'Close proximity to quiet Briech beaches'
      ],
      fr: [
        'Espace généreux de 110 m² idéal pour les familles',
        '2 salles de bain avec eau chaude et équipements récents',
        'Accès aisé avec place de stationnement réservée',
        'Proximité immédiate des plages paisibles de Briech'
      ],
      ar: [
        'مساحة رحبة 110 متر مربع مثالية للعطلات العائلية',
        'حمامان كاملان بالماء الساخن والتجهيزات الحديثة',
        'سهولة الوصول مع مكان مخصص لركن السيارة',
        'قرب شديد من شواطئ بريش الهادئة والآمنة'
      ],
      es: [
        'Generosa distribución de 110 m² perfecta para vacaciones familiares',
        '2 baños completos con agua caliente y equipamiento moderno',
        'Acceso cómodo en planta baja con plaza de aparcamiento privada',
        'Muy cerca de las tranquilas playas de Briech'
      ],
      de: [
        'Großzügige 110 m² Aufteilung, ideal für Familienurlaube',
        '2 vollwertige Badezimmer mit Warmwasser und modernen Armaturen',
        'Bequemer Zugang mit reserviertem Privatparkplatz',
        'Unmittelbare Nähe zu den ruhigen Stränden von Briech'
      ]
    },
    images: [
      '/src/assets/images/residence_exterior_sunset_1792176295267.jpg',
      '/src/assets/images/apartment_sea_view_1792176294057.jpg',
      '/src/assets/images/apartment_bedroom_1792176295110.jpg',
      '/src/assets/images/briech_beach_coast_1792176294889.jpg'
    ],
    status: 'available',
    featured: true,
    isDemo: true,
    demoNotice: {
      en: 'Sample demonstration listing. Real seasonal availability & rates are confirmed directly via WhatsApp.',
      fr: 'Annonce de démonstration. Disponibilités et tarifs réels confirmés directement par WhatsApp.',
      ar: 'نموذج توضيحي للاستعراض. التوفر الفعلي والأسعار يتم تأكيدها مباشرة عبر الواتساب.',
      es: 'Muestra de demostración. La disponibilidad y tarifas reales se confirman directamente por WhatsApp.',
      de: 'Beispiel-Eintrag. Verfügbarkeit und Endpreise werden direkt via WhatsApp bestätigt.'
    },
    createdAt: '2026-03-10T14:00:00Z'
  },
  {
    id: 'apt-studio-solstice-4',
    slug: 'panoramic-studio-solstice',
    title: {
      en: 'Panoramic Studio Solstice (1 Bedroom)',
      fr: 'Studio Panoramique Solstice (1 Chambre)',
      ar: 'استوديو الانقلاب البانورامي (غرفة واحدة)',
      es: 'Estudio Panorámico Solstice (1 Dormitorio)',
      de: 'Panorama-Studio Solstice (1 Schlafzimmer)'
    },
    shortDescription: {
      en: 'Intimate sunny studio with ocean balcony, ideal for a quiet seaside escape.',
      fr: 'Studio intimiste et ensoleillé avec balcon mer, parfait pour une escapade sereine.',
      ar: 'استوديو مشمس وهادئ بشرفة بحرية، مثالي لراحة البال والاستمتاع بالبحر.',
      es: 'Estudio íntimo y soleado con balcón al mar, perfecto para una escapada tranquila.',
      de: 'Gemütliches, sonniges Studio mit Meeresbalkon, ideal für einen erholsamen Kurzurlaub.'
    },
    description: {
      en: 'A bright, efficient studio apartment on the 2nd floor with direct Atlantic sunset orientation. Equipped with a double bed, private bathroom, kitchenette, and high-speed fiber internet.',
      fr: 'Un studio lumineux et fonctionnel au 2ème étage orienté plein ouest vers le coucher de soleil. Équipé d’un lit double, d’une salle d’eau privative, d’une kitchenette et d’une connexion fibre optique.',
      ar: 'استوديو منير وعملي بالطابق الثاني مع توجيه مباشر نحو غروب شمس الأطلسي. مجهز بسرير مزدوج، حمام خاص، مطبخ صغير وإنترنت فايبر سريع.',
      es: 'Estudio luminoso y práctico en 2ª planta con orientación directa a las puestas de sol atlánticas. Equipado con cama doble, baño privado, cocina americana e internet por fibra.',
      de: 'Helles und zweckmäßiges Studio im 2. Stock mit direkter Ausrichtung auf den Sonnenuntergang. Ausgestattet mit Doppelbett, eigenem Bad, Kochnische und Glasfaser-WLAN.'
    },
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    floor: 2,
    areaM2: 44,
    pricePerNight: 400,
    pricePerMonth: 5500,
    currency: 'MAD',
    furnished: true,
    seaView: true,
    balcony: true,
    amenities: [
      'seaView',
      'balcony',
      'wifi',
      'equippedKitchen',
      'freeParking',
      'smartTv'
    ],
    features: {
      en: [
        'Romantic sunset balcony view',
        'Economical stay for couples or solo travelers',
        'Convenient kitchenette for daily meals',
        'Quiet residential environment'
      ],
      fr: [
        'Vue romantique sur le coucher de soleil depuis le balcon',
        'Séjour économique pour couple ou voyageur solo',
        'Kitchenette pratique pour les repas quotidiens',
        'Environnement calme et reposant'
      ],
      ar: [
        'إطلالة رومانسية على غروب الشمس من الشرفة',
        'إقامة اقتصادية ومريحة للأزواج أو المسافرين الفرديين',
        'مطبخ صغير عملي للوجبات اليومية',
        'بيئة سكنية هادئة ومريحة'
      ],
      es: [
        'Romántica vista al atardecer desde el balcón',
        'Estancia económica para parejas o viajeros solos',
        'Cocina americana práctica para comidas diarias',
        'Entorno residencial tranquilo'
      ],
      de: [
        'Romantischer Sonnenuntergangsblick vom Balkon',
        'Preiswerte Unterkunft für Paare oder Alleinreisende',
        'Praktische Kochnische für die tägliche Verpflegung',
        'Ruhige Wohnumgebung'
      ]
    },
    images: [
      '/src/assets/images/apartment_bedroom_1792176295110.jpg',
      '/src/assets/images/apartment_sea_view_1792176294057.jpg',
      '/src/assets/images/hero_sunset_coastal_1792176292926.jpg'
    ],
    status: 'available',
    featured: false,
    isDemo: true,
    demoNotice: {
      en: 'Sample demonstration listing. Real seasonal availability & rates are confirmed directly via WhatsApp.',
      fr: 'Annonce de démonstration. Disponibilités et tarifs réels confirmés directement par WhatsApp.',
      ar: 'نموذج توضيحي للاستعراض. التوفر الفعلي والأسعار يتم تأكيدها مباشرة عبر الواتساب.',
      es: 'Muestra de demostración. La disponibilidad y tarifas reales se confirman directamente por WhatsApp.',
      de: 'Beispiel-Eintrag. Verfügbarkeit und Endpreise werden direkt via WhatsApp bestätigt.'
    },
    createdAt: '2026-03-12T09:00:00Z'
  }
];

export const initialGalleryItems = [
  {
    id: 'gal-1',
    category: 'sunset',
    title: {
      en: 'Sunset over Ghorob Chams Residence balconies and Briech coastline',
      fr: 'Coucher de soleil sur les balcons de la résidence et la côte de Briech',
      ar: 'غروب الشمس فوق شرفات إقامة غروب شمس وشاطئ بريش',
      es: 'Puesta de sol sobre los balcones de la residencia y la costa de Briech',
      de: 'Sonnenuntergang über den Balkonen der Residenz und der Küste von Briech'
    },
    src: '/src/assets/images/hero_sunset_coastal_1792176292926.jpg',
    aspect: '16:9'
  },
  {
    id: 'gal-2',
    category: 'apartments',
    title: {
      en: 'Oceanfront living room with natural sea light and balcony access',
      fr: 'Salon face à l’océan baigné de lumière naturelle avec accès terrasse',
      ar: 'صالون مواجه للمحيط بإنارة طبيعية وشرفة مفتوحة',
      es: 'Salón frente al océano con luz natural y acceso a la terraza',
      de: 'Wohnzimmer mit Meerblick, natürlichem Licht und Terrassenzugang'
    },
    src: '/src/assets/images/apartment_sea_view_1792176294057.jpg',
    aspect: '4:3'
  },
  {
    id: 'gal-3',
    category: 'apartments',
    title: {
      en: 'Peaceful master bedroom with terrace door and ocean horizon',
      fr: 'Chambre principale paisible avec porte-fenêtre et vue sur l’océan',
      ar: 'غرفة نوم هادئة ومريحة مع نافذة تطل على الأفق الأطلسي',
      es: 'Dormitorio principal sereno con puerta hacia la terraza y vista al mar',
      de: 'Ruhiges Hauptschlafzimmer mit Terrassentür und Horizontblick auf den Ozean'
    },
    src: '/src/assets/images/apartment_bedroom_1792176295110.jpg',
    aspect: '4:3'
  },
  {
    id: 'gal-4',
    category: 'briech',
    title: {
      en: 'Briech coastal beach and golden sand dunes at golden hour near Asilah',
      fr: 'Plage et dunes dorées de Briech à l’heure dorée près d’Assilah',
      ar: 'شاطئ وكثبان بريش الذهبية عند الغروب قرب أصيلة',
      es: 'Playa y dunas doradas de Briech al atardecer cerca de Arcila',
      de: 'Strand und goldene Dünen von Briech im Abendlicht nahe Asilah'
    },
    src: '/src/assets/images/briech_beach_coast_1792176294889.jpg',
    aspect: '16:9'
  },
  {
    id: 'gal-5',
    category: 'balconies',
    title: {
      en: 'Seaside residence architecture with flowering gardens and sunset lighting',
      fr: 'Architecture de la résidence avec jardins fleuris et lumière du soir',
      ar: 'المبنى المعماري للإقامة مع حدائق خضراء وإنارة المساء الدافئة',
      es: 'Arquitectura de la residencia costera con jardines y luz del atardecer',
      de: 'Küstenresidenz-Architektur mit blühenden Gärten im Abendlicht'
    },
    src: '/src/assets/images/residence_exterior_sunset_1792176295267.jpg',
    aspect: '4:3'
  }
];
