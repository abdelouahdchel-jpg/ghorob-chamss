import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { getDataStore } from './server/storage/index';
import { IDataStore } from './server/storage/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Persistent Uploads Directory
const UPLOADS_DIR = path.join(__dirname, 'data', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Security & Password Hashing Configuration
const SECRET_KEY =
  process.env.ADMIN_SECRET_KEY ||
  process.env.SESSION_SECRET ||
  'ghorob_chams_salt_2026';

if (isProduction && !process.env.ADMIN_SECRET_KEY && !process.env.SESSION_SECRET) {
  console.warn(
    '\n⚠️  [SECURITY WARNING] Running in production without ADMIN_SECRET_KEY or SESSION_SECRET!\n' +
      'Please configure ADMIN_SECRET_KEY in your production environment variables.\n'
  );
}

function hashPassword(password: string): string {
  return crypto.createHmac('sha256', SECRET_KEY).update(password).digest('hex');
}

function verifyPassword(inputPassword: string, storedHash: string): boolean {
  try {
    const inputHash = hashPassword(inputPassword);
    const inputBuf = Buffer.from(inputHash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (inputBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(inputBuf, storedBuf);
  } catch {
    return false;
  }
}

// In-Memory Rate Limiting
interface RateLimitEntry {
  count: number;
  firstSeen: number;
}
const loginRateLimitMap = new Map<string, RateLimitEntry>();
const inquiryRateLimitMap = new Map<string, RateLimitEntry>();

function createRateLimiter(
  map: Map<string, RateLimitEntry>,
  maxRequests: number,
  windowMs: number,
  message: string
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = map.get(ip);

    if (!entry || now - entry.firstSeen > windowMs) {
      map.set(ip, { count: 1, firstSeen: now });
      return next();
    }

    if (entry.count >= maxRequests) {
      res.status(429).json({ error: message });
      return;
    }

    entry.count++;
    next();
  };
}

const loginRateLimiter = createRateLimiter(
  loginRateLimitMap,
  5,
  15 * 60 * 1000,
  'Too many login attempts. Please wait 15 minutes before trying again.'
);

const inquiryRateLimiter = createRateLimiter(
  inquiryRateLimitMap,
  15,
  60 * 60 * 1000,
  'Too many booking requests from this network. Please try again later.'
);

async function startServer() {
  // Initialize Portable Data Store (PostgreSQL if DATABASE_URL is set, else JSON file)
  const store: IDataStore = await getDataStore();

  // Ensure Admin Password exists or synchronize with ADMIN_PASSWORD / ADMIN_USERNAME env if explicitly provided
  const configuredPassword = process.env.ADMIN_PASSWORD?.trim();
  const configuredUsername = process.env.ADMIN_USERNAME?.trim();
  const existingAdmin = await store.getAdminUser();

  if (configuredPassword) {
    const expectedHash = hashPassword(configuredPassword);
    if (!existingAdmin || existingAdmin.passwordHash !== expectedHash || (configuredUsername && existingAdmin.username !== configuredUsername)) {
      await store.setAdminPassword(expectedHash);
      console.log('[SECURITY] Administrator credentials synchronized from environment variables.');
    }
  } else if (!existingAdmin || !existingAdmin.passwordHash) {
    const initialPassword = 'GhorobChams2026!';
    await store.setAdminPassword(hashPassword(initialPassword));
    console.log('[SECURITY] Initial admin password set to: GhorobChams2026!');
    console.log('[SECURITY] Set ADMIN_PASSWORD in your environment variables or change it in the dashboard to customize.');
  }

  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '10mb' }));

  // CORS Configuration for decoupled frontend hosting
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
    : '*';

  app.use(
    cors({
      origin: corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );

  // Serve persistent uploaded property images
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Authentication Middleware
  const authenticateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized. Administrator authentication required.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const isValid = await store.validateSession(token);
    if (!isValid) {
      res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
      return;
    }

    next();
  };

  // Health Check Endpoint
  app.get('/api/health', async (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      storageDriver: store.getDriverName(),
      environment: NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // Dynamic Sitemap
  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    try {
      const domain = process.env.APP_URL || 'https://ghorob-chams-residence.ma';
      const apartments = await store.getApartments();
      const pages = ['', '/apartments', '/about', '/gallery', '/location', '/contact', '/privacy', '/terms'];

      const aptUrls = apartments
        .map(
          apt => `
  <url>
    <loc>${domain}/apartments/${apt.slug}</loc>
    <lastmod>${new Date(apt.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
        )
        .join('');

      const pageUrls = pages
        .map(
          p => `
  <url>
    <loc>${domain}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '' ? '1.0' : '0.8'}</priority>
  </url>`
        )
        .join('');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageUrls}
${aptUrls}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      res.status(500).send('Error generating sitemap');
    }
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
  app.get('/api/settings', async (_req: Request, res: Response) => {
    try {
      const settings = await store.getSettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve site settings' });
    }
  });

  // Protected: Update site settings
  app.put('/api/settings', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await store.updateSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update site settings' });
    }
  });

  // Public: Get apartments
  app.get('/api/apartments', async (_req: Request, res: Response) => {
    try {
      const apartments = await store.getApartments();
      res.json(apartments);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve apartments' });
    }
  });

  // Public: Get single apartment by ID or slug
  app.get('/api/apartments/:idOrSlug', async (req: Request, res: Response) => {
    try {
      const apt = await store.getApartmentByIdOrSlug(req.params.idOrSlug);
      if (!apt) {
        res.status(404).json({ error: 'Apartment not found' });
        return;
      }
      res.json(apt);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving apartment details' });
    }
  });

  // Protected: Create apartment
  app.post('/api/apartments', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { title, pricePerNight, bedrooms } = req.body;
      if (!title || !pricePerNight || !bedrooms) {
        res.status(400).json({ error: 'Title, price per night, and bedroom count are required.' });
        return;
      }

      const id = req.body.id || `apt-${Date.now()}`;
      const slug =
        req.body.slug ||
        `apt-${id
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')}`;

      const newApartment = {
        ...req.body,
        id,
        slug,
        createdAt: req.body.createdAt || new Date().toISOString()
      };

      const created = await store.createApartment(newApartment);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create apartment' });
    }
  });

  // Protected: Update apartment
  app.put('/api/apartments/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await store.updateApartment(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Apartment not found' });
        return;
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to update apartment' });
    }
  });

  // Protected: Delete apartment
  app.delete('/api/apartments/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const deleted = await store.deleteApartment(req.params.id);
      if (!deleted) {
        res.status(404).json({ error: 'Apartment not found' });
        return;
      }
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete apartment' });
    }
  });

  // Protected: Upload apartment photo (supports photos from Android camera & phone gallery)
  app.post('/api/upload', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { image, filename } = req.body;
      if (!image || typeof image !== 'string') {
        res.status(400).json({ error: 'Image data is required.' });
        return;
      }

      // Support base64 image data URL
      const matches = image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        res.status(400).json({ error: 'Invalid image format. Expected base64 image data URL.' });
        return;
      }

      let ext = matches[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      if (!['jpg', 'png', 'webp', 'gif', 'svg'].includes(ext)) {
        ext = 'jpg';
      }

      const buffer = Buffer.from(matches[2], 'base64');
      if (buffer.length > 10 * 1024 * 1024) {
        res.status(400).json({ error: 'Image file too large. Maximum size is 10MB.' });
        return;
      }

      const safeBase = filename
        ? path.basename(filename).replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 30)
        : 'apartment_photo';
      const uniqueFilename = `apt-${Date.now()}-${crypto.randomBytes(4).toString('hex')}-${safeBase}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, uniqueFilename);

      await fs.promises.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${uniqueFilename}`;
      console.log(`[UPLOAD] Apartment photo saved: ${publicUrl} (${(buffer.length / 1024).toFixed(1)} KB)`);

      res.status(201).json({
        success: true,
        url: publicUrl,
        filename: uniqueFilename,
        sizeBytes: buffer.length
      });
    } catch (err: any) {
      console.error('[UPLOAD ERROR]', err);
      res.status(500).json({ error: err.message || 'Failed to save uploaded image' });
    }
  });

  // Public: Submit booking inquiry (with Rate Limiting, Validation, and Spam Protection)
  app.post('/api/inquiries', inquiryRateLimiter, async (req: Request, res: Response) => {
    try {
      const { guestName, phone, countryCode, apartmentId, checkIn, checkOut, guestsCount, message, email, honeypot } =
        req.body;

      // Honeypot anti-spam check
      if (honeypot) {
        res.status(200).json({ success: true, reference: 'GC-BLOCKED' });
        return;
      }

      // Input Validation
      if (!guestName || typeof guestName !== 'string' || guestName.trim().length < 2) {
        res.status(400).json({ error: 'Please provide a valid full name.' });
        return;
      }
      if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
        res.status(400).json({ error: 'Please provide a valid phone/WhatsApp number.' });
        return;
      }
      if (!checkIn || !checkOut) {
        res.status(400).json({ error: 'Please specify arrival and departure dates.' });
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime()) || checkOutDate <= checkInDate) {
        res.status(400).json({ error: 'Departure date must be after arrival date.' });
        return;
      }

      const nights = Math.max(
        1,
        Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
      );

      const apt = apartmentId ? await store.getApartmentByIdOrSlug(apartmentId) : null;
      const apartmentTitle = apt ? apt.title.en : req.body.apartmentTitle || 'Apartment Booking';
      const ratePerNight = apt ? apt.pricePerNight : 500;
      const estimatedTotal = nights * ratePerNight;

      const referenceId = `GC-${Math.floor(100000 + Math.random() * 900000)}`;

      const newInquiry = {
        id: referenceId,
        guestName: guestName.trim(),
        phone: phone.trim(),
        countryCode: countryCode || '+212',
        email: email ? String(email).trim() : undefined,
        apartmentId: apartmentId || 'general',
        apartmentTitle,
        checkIn,
        checkOut,
        guestsCount: Number(guestsCount) || 2,
        nightsCount: nights,
        estimatedTotal,
        currency: 'MAD',
        message: message ? String(message).trim() : '',
        status: 'new' as const,
        createdAt: new Date().toISOString()
      };

      const created = await store.createInquiry(newInquiry);

      res.status(201).json({
        success: true,
        reference: referenceId,
        inquiry: created,
        message: 'Booking inquiry submitted successfully.'
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to submit booking inquiry' });
    }
  });

  // Protected: Get all inquiries
  app.get('/api/inquiries', authenticateAdmin, async (_req: Request, res: Response) => {
    try {
      const inquiries = await store.getInquiries();
      res.json(inquiries);
    } catch (err) {
      res.status(500).json({ error: 'Failed to retrieve booking inquiries' });
    }
  });

  // Protected: Update inquiry status
  app.put('/api/inquiries/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const updated = await store.updateInquiryStatus(req.params.id, req.body.status);
      if (!updated) {
        res.status(404).json({ error: 'Inquiry not found' });
        return;
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: 'Failed to update inquiry' });
    }
  });

  // Protected: Delete inquiry
  app.delete('/api/inquiries/:id', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const id = req.params.id?.trim();
      if (!id) {
        res.status(400).json({ error: 'Inquiry ID is required' });
        return;
      }
      const deleted = await store.deleteInquiry(id);
      if (!deleted) {
        res.status(404).json({ error: 'Inquiry not found or already deleted' });
        return;
      }
      res.json({ success: true, message: 'Inquiry deleted successfully' });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to delete inquiry' });
    }
  });

  // Auth: Admin login with Rate Limiting and Timing-Safe comparison
  app.post('/api/auth/login', loginRateLimiter, async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      if (!password || typeof password !== 'string') {
        res.status(400).json({ error: 'Password required' });
        return;
      }

      const admin = await store.getAdminUser();
      if (!admin || !verifyPassword(password, admin.passwordHash)) {
        res.status(401).json({ error: 'Incorrect administrator password.' });
        return;
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days

      await store.createSession({
        token,
        createdAt: new Date().toISOString(),
        expiresAt
      });

      res.json({
        success: true,
        token,
        user: {
          username: admin.username,
          role: 'owner'
        }
      });
    } catch (err) {
      res.status(500).json({ error: 'Authentication service error' });
    }
  });

  // Auth: Verify token
  app.get('/api/auth/verify', authenticateAdmin, (_req: Request, res: Response) => {
    res.json({ valid: true });
  });

  // Auth: Change password
  app.post('/api/auth/change-password', authenticateAdmin, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
        res.status(400).json({ error: 'New password must be at least 8 characters long.' });
        return;
      }

      const admin = await store.getAdminUser();
      if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
        res.status(400).json({ error: 'Current password is incorrect.' });
        return;
      }

      const newHash = hashPassword(newPassword);
      await store.setAdminPassword(newHash);

      res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update administrator password' });
    }
  });

  // Auth: Logout
  app.post('/api/auth/logout', authenticateAdmin, async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      await store.deleteSession(token);
    }
    res.json({ success: true });
  });

  // Frontend Serving (Vite in Dev, Compiled Static Bundle in Production)
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
    console.log(
      `\n🌟 [Ghorob Chams Residence] Server running on port ${PORT} [Mode: ${NODE_ENV}] [Storage: ${store.getDriverName()}]\n`
    );
  });
}

startServer().catch(err => {
  console.error('[FATAL] Failed to initialize server:', err);
  process.exit(1);
});
