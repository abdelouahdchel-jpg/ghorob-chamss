import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default initial credentials & seed data
const DEFAULT_SALT = 'ghorob_chams_salt_2026';
function hashPassword(pwd: string): string {
  return crypto.createHmac('sha256', DEFAULT_SALT).update(pwd).digest('hex');
}

// Default initial password: GhorobChams2026!
const DEFAULT_ADMIN_HASH = hashPassword('GhorobChams2026!');

interface DatabaseSchema {
  admin: {
    username: string;
    passwordHash: string;
    sessions: { token: string; createdAt: string; expiresAt: string }[];
  };
  settings: any;
  apartments: any[];
  inquiries: any[];
}

function ensureDataStorage(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Error reading database file, backing up and reinitializing', e);
    }
  }

  // Load initial fallback data
  const initialData: DatabaseSchema = {
    admin: {
      username: 'owner',
      passwordHash: DEFAULT_ADMIN_HASH,
      sessions: []
    },
    settings: {
      whatsappNumber: '212638194995',
      whatsappDisplay: '+212 638 19 49 95',
      contactPhone: '+212 638 19 49 95',
      contactEmail: 'contact@ghorobchams.ma',
      address: {
        en: 'Coastal Road, Briech (10 km north of Asilah), Tangier-Tetouan-Al Hoceima, Morocco',
        fr: 'Route Côtière, Briech (à 10 km au nord d’Assilah), Tanger-Tétouan-Al Hoceïma, Maroc',
        ar: 'الطريق الساحلية، بريش (10 كلم شمال مدينة أصيلة)، جهة طنجة تطوان الحسيمة، المغرب'
      },
      briechLocationDetails: {
        en: 'Situated along the Atlantic coastline in Briech. Peaceful retreat 10 minutes drive from Asilah historic medina and 30 minutes from Tangier airport.',
        fr: 'Situé sur le littoral atlantique à Briech. Retraite paisible à 10 minutes en voiture de la médina d’Assilah et 30 minutes de l’aéroport de Tanger.',
        ar: 'موقع مميز على الشريط الساحلي الأطلسي ببريش. ملاذ هادئ على بعد 10 دقائق بالسيارة من مدينة أصيلة و30 دقيقة من مطار طنجة.'
      },
      googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Briech%20Morocco&t=&z=14&ie=UTF8&iwloc=&output=embed',
      googleMapsLink: 'https://maps.google.com/?q=35.5398246,-5.9890000',
      checkInTime: '15:00',
      checkOutTime: '11:00',
      minNights: 2,
      currency: 'MAD',
      facebookUrl: 'https://facebook.com/ghorobchamsresidence',
      instagramUrl: 'https://instagram.com/ghorobchamsresidence'
    },
    apartments: [
      {
        id: 'apt-sunset-penthouse-1',
        slug: 'penthouse-sunset-horizon-briech',
        title: {
          en: 'Penthouse Sunset Horizon (2 Bedrooms)',
          fr: 'Penthouse Horizon Couchant (2 Chambres)',
          ar: 'بنثاوس أفق الغروب (غرفتا نوم)'
        },
        shortDescription: {
          en: 'Panoramic top-floor apartment with a wide sunset balcony facing the Atlantic Ocean.',
          fr: 'Appartement au dernier étage avec grand balcon face au coucher de soleil sur l’Atlantique.',
          ar: 'شقة فاخرة بالطابق العلوي مع شرفة واسعة تطل مباشرة على غروب شمس المحيط الأطلسي.'
        },
        description: {
          en: 'A bright, beautifully furnished 2-bedroom penthouse designed for relaxed coastal living in Briech. Features a wide private terrace facing west toward the Atlantic sunset, a sunlit living room with comfortable seating, a fully equipped open kitchen with refrigerator, stovetop, and cookware, plus high-speed WiFi and air conditioning.',
          fr: 'Un magnifique penthouse de 2 chambres meublé avec soin pour un séjour côtier reposant à Briech. Comprend une grande terrasse privative orientée plein ouest face au coucher de soleil sur l’Atlantique, un salon baigné de lumière, une cuisine équipée avec réfrigérateur et plaques, ainsi que le WiFi haut débit et la climatisation.',
          ar: 'بنثاوس مشمس ومفروش بعناية يضم غرفتي نوم ومصمم للاسترخاء الساحلي الهادئ في بريش. يتميز بتراس خاص واسع يتجه غرباً نحو غروب الشمس فوق المحيط الأطلسي، صالون مريح بإنارة طبيعية، مطبخ متكامل التجهيز مع ثلاجة وموقد، بالإضافة إلى إنترنت واي فاي سريع ومكيف هواء.'
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
        createdAt: '2026-03-01T10:00:00Z'
      },
      {
        id: 'apt-coastal-suite-2',
        slug: 'coastal-breeze-suite-briech',
        title: {
          en: 'Coastal Breeze Suite (1 Bedroom)',
          fr: 'Suite Brise Marine (1 Chambre)',
          ar: 'جناح نسيم الشاطئ (غرفة نوم واحدة)'
        },
        shortDescription: {
          en: 'Cozy and stylish oceanfront apartment ideal for couples or solo travelers seeking calm.',
          fr: 'Appartement chaleureux et raffiné face à la mer, idéal pour couples ou séjours au calme.',
          ar: 'شقة دافئة وأنيقة مطلة على البحر مثالية للأزواج أو الراغبين في الهدوء والسكينة.'
        },
        description: {
          en: 'A quiet 1-bedroom furnished retreat featuring floor-to-ceiling balcony doors, calming neutral coastal tones, an equipped kitchenette, modern bathroom, and dedicated workspace. Perfect for weekend getaways near Asilah or focused remote work with Atlantic breezes.',
          fr: 'Un cocon meublé d’une chambre avec baies vitrées donnant sur le balcon, décoration soignée aux tons marins, kitchenette équipée, salle d’eau moderne et espace bureau. Idéal pour des escapades de week-end près d’Assilah ou pour le télétravail en bord de mer.',
          ar: 'ملاذ هادئ مفروش بغرفة نوم واحدة مع أبواب شرفة زجاجية ممتدة، ألوان ساحلية مريحة، مطبخ صغير مجهز، حمام عصري ومكتب عمل. مثالية للعطلات القصيرة قرب أصيلة أو العمل عن بعد في أجواء نسيم الأطلسي.'
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
        createdAt: '2026-03-05T12:00:00Z'
      },
      {
        id: 'apt-atlantic-family-3',
        slug: 'family-atlantic-haven-briech',
        title: {
          en: 'Family Atlantic Haven (3 Bedrooms)',
          fr: 'Havre Familial Atlantique (3 Chambres)',
          ar: 'ملاذ الأطلسي العائلي (3 غرف نوم)'
        },
        shortDescription: {
          en: 'Spacious 3-bedroom family apartment with large dining salon and expansive terrace.',
          fr: 'Grand appartement familial de 3 chambres avec vaste salon marocain et grande terrasse.',
          ar: 'شقة عائلية واسعة تضم 3 غرف نوم وصالون كبير مع شرفة فسيحة للعائلات.'
        },
        description: {
          en: 'Generous family residence in Briech accommodating up to 6 guests. Features three independent bedrooms, two clean bathrooms, a large Moroccan-contemporary living salon, complete family kitchen, and a peaceful garden and sea-glimpse terrace.',
          fr: 'Résidence familiale spacieuse à Briech pouvant accueillir jusqu’à 6 personnes. Offre trois chambres indépendantes, deux salles de bain, un grand salon mariant confort marocain et touches modernes, une cuisine familiale complète et une terrasse au calme.',
          ar: 'شقة عائلية فسيحة في بريش تتسع لما يصل إلى 6 أشخاص. تضم 3 غرف نوم مستقلة، حمامين نظيفين، صالون مغربي عصري رحب، مطبخ عائلي متكامل، وشرفة هادئة مطلة على الطبيعة ولمحات من البحر.'
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
        createdAt: '2026-03-10T14:00:00Z'
      },
      {
        id: 'apt-studio-solstice-4',
        slug: 'panoramic-studio-solstice',
        title: {
          en: 'Panoramic Studio Solstice (1 Bedroom)',
          fr: 'Studio Panoramique Solstice (1 Chambre)',
          ar: 'استوديو الانقلاب البانورامي (غرفة واحدة)'
        },
        shortDescription: {
          en: 'Intimate sunny studio with ocean balcony, ideal for a quiet seaside escape.',
          fr: 'Studio intimiste et ensoleillé avec balcon mer, parfait pour une escapade sereine.',
          ar: 'استوديو مشمس وهادئ بشرفة بحرية، مثالي لراحة البال والاستمتاع بالبحر.'
        },
        description: {
          en: 'A bright, efficient studio apartment on the 2nd floor with direct Atlantic sunset orientation. Equipped with a double bed, private bathroom, kitchenette, and high-speed fiber internet.',
          fr: 'Un studio lumineux et fonctionnel au 2ème étage orienté plein ouest vers le coucher de soleil. Équipé d’un lit double, d’une salle d’eau privative, d’une kitchenette et d’une connexion fibre optique.',
          ar: 'استوديو منير وعملي بالطابق الثاني مع توجيه مباشر نحو غروب شمس الأطلسي. مجهز بسرير مزدوج، حمام خاص، مطبخ صغير وإنترنت فايبر سريع.'
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
        createdAt: '2026-03-12T09:00:00Z'
      }
    ],
    inquiries: [
      {
        id: 'inq-sample-101',
        guestName: 'Yassine El Fassi',
        phone: '0661234567',
        countryCode: '+212',
        email: 'yassine.elfassi@example.com',
        apartmentId: 'apt-sunset-penthouse-1',
        apartmentTitle: 'Penthouse Sunset Horizon (2 Bedrooms)',
        checkIn: '2026-07-15',
        checkOut: '2026-07-20',
        guestsCount: 4,
        nightsCount: 5,
        estimatedTotal: 3250,
        currency: 'MAD',
        message: 'Family vacation with two children. Requesting quiet floor and sunset terrace orientation.',
        status: 'new',
        createdAt: '2026-04-10T11:20:00Z'
      }
    ]
  };

  saveData(initialData);
  return initialData;
}

function saveData(data: DatabaseSchema): void {
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DB_FILE);
}

// Authentication Middleware
function authenticateAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const db = ensureDataStorage();

  const session = db.admin.sessions.find(
    s => s.token === token && new Date(s.expiresAt).getTime() > Date.now()
  );

  if (!session) {
    res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
    return;
  }

  next();
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Dynamic Sitemap
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const db = ensureDataStorage();
    const domain = process.env.APP_URL || 'https://ghorob-chams-residence.ma';
    const pages = [
      '',
      '/apartments',
      '/about',
      '/gallery',
      '/location',
      '/contact',
      '/privacy',
      '/terms'
    ];

    const aptUrls = db.apartments.map(
      apt => `
  <url>
    <loc>${domain}/apartments/${apt.slug}</loc>
    <lastmod>${new Date(apt.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ).join('');

    const pageUrls = pages.map(
      p => `
  <url>
    <loc>${domain}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`
    ).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls}
${aptUrls}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Dynamic Robots.txt
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const domain = process.env.APP_URL || 'https://ghorob-chams-residence.ma';
    const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${domain}/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(content);
  });

  // Public: Get site settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    const db = ensureDataStorage();
    res.json(db.settings);
  });

  // Protected: Update site settings
  app.put('/api/settings', authenticateAdmin, (req: Request, res: Response) => {
    const db = ensureDataStorage();
    db.settings = { ...db.settings, ...req.body };
    saveData(db);
    res.json({ success: true, settings: db.settings });
  });

  // Public: Get apartments
  app.get('/api/apartments', (_req: Request, res: Response) => {
    const db = ensureDataStorage();
    res.json(db.apartments);
  });

  // Public: Get single apartment
  app.get('/api/apartments/:idOrSlug', (req: Request, res: Response) => {
    const db = ensureDataStorage();
    const item = db.apartments.find(
      a => a.id === req.params.idOrSlug || a.slug === req.params.idOrSlug
    );
    if (!item) {
      res.status(404).json({ error: 'Apartment not found' });
      return;
    }
    res.json(item);
  });

  // Protected: Create apartment
  app.post('/api/apartments', authenticateAdmin, (req: Request, res: Response) => {
    const db = ensureDataStorage();
    const newApartment = {
      ...req.body,
      id: req.body.id || `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.apartments.push(newApartment);
    saveData(db);
    res.status(201).json(newApartment);
  });

  // Protected: Update apartment
  app.put('/api/apartments/:id', authenticateAdmin, (req: Request, res: Response) => {
    const db = ensureDataStorage();
    const index = db.apartments.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Apartment not found' });
      return;
    }
    db.apartments[index] = { ...db.apartments[index], ...req.body };
    saveData(db);
    res.json(db.apartments[index]);
  });

  // Protected: Delete apartment
  app.delete('/api/apartments/:id', authenticateAdmin, (req: Request, res: Response) => {
    const db = ensureDataStorage();
    const index = db.apartments.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Apartment not found' });
      return;
    }
    db.apartments.splice(index, 1);
    saveData(db);
    res.json({ success: true });
  });

  // Public: Submit booking inquiry
  app.post('/api/inquiries', (req: Request, res: Response) => {
    const { guestName, phone, countryCode, apartmentId, checkIn, checkOut, guestsCount, message, email } = req.body;

    // Strict validation
    if (!guestName || typeof guestName !== 'string' || guestName.trim().length < 2) {
      res.status(400).json({ error: 'Please provide a valid full name.' });
      return;
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      res.status(400).json({ error: 'Please provide a valid WhatsApp phone number.' });
      return;
    }
    if (!checkIn || !checkOut) {
      res.status(400).json({ error: 'Please specify arrival and departure dates.' });
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));

    const db = ensureDataStorage();
    const apt = db.apartments.find(a => a.id === apartmentId);
    const apartmentTitle = apt ? apt.title.en : 'Apartment Inquiry';
    const ratePerNight = apt ? apt.pricePerNight : 500;
    const estimatedTotal = nights * ratePerNight;

    const referenceId = `GC-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInquiry = {
      id: referenceId,
      guestName: guestName.trim(),
      phone: phone.trim(),
      countryCode: countryCode || '+212',
      email: email ? email.trim() : undefined,
      apartmentId: apartmentId || 'general',
      apartmentTitle,
      checkIn,
      checkOut,
      guestsCount: Number(guestsCount) || 2,
      nightsCount: nights,
      estimatedTotal,
      currency: 'MAD',
      message: message ? message.trim() : '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.inquiries.unshift(newInquiry);
    saveData(db);

    res.status(201).json({
      success: true,
      reference: referenceId,
      inquiry: newInquiry,
      message: 'Booking inquiry submitted successfully.'
    });
  });

  // Protected: Get all inquiries
  app.get('/api/inquiries', authenticateAdmin, (_req: Request, res: Response) => {
    const db = ensureDataStorage();
    res.json(db.inquiries);
  });

  // Protected: Update inquiry status
  app.put('/api/inquiries/:id', authenticateAdmin, (req: Request, res: Response) => {
    const db = ensureDataStorage();
    const inq = db.inquiries.find(i => i.id === req.params.id);
    if (!inq) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }
    if (req.body.status) {
      inq.status = req.body.status;
    }
    saveData(db);
    res.json(inq);
  });

  // Protected: Delete inquiry
  app.delete('/api/inquiries/:id', authenticateAdmin, (req: Request, res: Response) => {
    const db = ensureDataStorage();
    const index = db.inquiries.findIndex(i => i.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Inquiry not found' });
      return;
    }
    db.inquiries.splice(index, 1);
    saveData(db);
    res.json({ success: true });
  });

  // Auth: Admin login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: 'Password required' });
      return;
    }

    const db = ensureDataStorage();
    const hashed = hashPassword(password);

    if (hashed !== db.admin.passwordHash) {
      res.status(401).json({ error: 'Incorrect administrator password.' });
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

    db.admin.sessions.push({
      token,
      createdAt: new Date().toISOString(),
      expiresAt
    });

    saveData(db);

    res.json({
      success: true,
      token,
      user: {
        username: db.admin.username,
        role: 'owner'
      }
    });
  });

  // Auth: Verify token
  app.get('/api/auth/verify', authenticateAdmin, (_req: Request, res: Response) => {
    res.json({ valid: true });
  });

  // Auth: Change password
  app.post('/api/auth/change-password', authenticateAdmin, (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters.' });
      return;
    }

    const db = ensureDataStorage();
    if (hashPassword(currentPassword) !== db.admin.passwordHash) {
      res.status(400).json({ error: 'Current password is incorrect.' });
      return;
    }

    db.admin.passwordHash = hashPassword(newPassword);
    saveData(db);
    res.json({ success: true, message: 'Password changed successfully.' });
  });

  // Vite Integration for dev / static for prod
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Ghorob Chams Residence server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
