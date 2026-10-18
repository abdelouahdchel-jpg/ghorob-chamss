# إقامة غروب شمس | Ghorob Chams Residence

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4-green.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg)](https://www.postgresql.org/)

A portable, production-ready, multilingual holiday rental and real estate platform for **Ghorob Chams Residence (إقامة غروب شمس)**, situated along the Atlantic coast in **Briech** (approx. 10 km north of **Asilah**, Morocco).

---

## 📑 Table of Contents

1. [Features & Architecture](#-features--architecture)
2. [Quickstart (Local Development)](#-quickstart-local-development)
3. [Deployment Options](#-deployment-options)
   - [Option A: Free Static Hosting (Vercel, Netlify, Cloudflare Pages)](#option-a-free-static-hosting-frontend-only)
   - [Option B: Full-Stack Cloud Hosting (Render, Railway, Fly.io)](#option-b-full-stack-cloud-hosting-recommended)
   - [Option C: Generic VPS / Linux Server (Ubuntu, Debian, Hostinger, DigitalOcean)](#option-c-generic-vps--linux-server)
   - [Option D: Docker & Docker Compose](#option-d-docker--docker-compose)
4. [Database & Data Portability (PostgreSQL & JSON Store)](#-database--data-portability)
5. [Property Images & Media Storage](#-property-images--media-storage)
6. [Security & Authentication](#-security--authentication)
7. [Environment Variables Reference](#-environment-variables-reference)
8. [Connecting Custom Domain & HTTPS](#-connecting-custom-domain--https)

---

## 🌟 Features & Architecture

### 1. Multilingual Engine & Automatic Detection
- **5 Supported Languages**:
  - **Arabic (العربية)**: Full Right-to-Left (`dir="rtl"`) layout with Moroccan/Andalusian styling.
  - **English**, **French (Français)**, **Spanish (Español)**, and **German (Deutsch)** in LTR.
- **Automatic Language Detection**: Detects visitor's browser preference via `navigator.languages` on their first visit, falling back to English for unlisted locales.
- **Manual Switcher**: Header & mobile navigation language selector with instant `localStorage` persistence.
- **Pure Consistency**: All navigation items, property descriptions, amenities, filters, forms, validation messages, and footer text are localized.

### 2. Apartment Listings & Booking Flow
- 4 curated coastal apartments with real photos, capacity, floor levels, amenities (WiFi, AC, sea view, parking), and dynamic stay price calculator.
- Validated booking inquiry form with anti-spam honeypot.
- Click-to-chat WhatsApp direct reservation linking to official phone: **`+212 638 19 49 95`** (`212638194995`).
- Floating WhatsApp booking widget with localized greeting messages.

### 3. Owner & Administrator Portal
- Access via **Owner Portal / لوحة الإدارة** in the footer or direct route `/#admin`.
- Apartment management: add, update, delete listings, toggle availability status (`available`, `reserved`, `maintenance`), and update rates.
- Guest inquiries management: review check-in/out dates, guest counts, contact phone, and open WhatsApp conversations directly.
- Site settings: update phone, email, address, and change administrator password.

---

## 💻 Quickstart (Local Development)

### Prerequisites
- Node.js 18, 20, or 22+
- npm or bun

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd ghorob-chams-residence

# 2. Install dependencies
npm install

# 3. Copy environment configuration
cp .env.example .env

# 4. Start development server (serves frontend + Express API with hot-reload)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🚀 Deployment Options

### Option A: Free Static Hosting (Frontend Only)
**Providers:** Vercel, Netlify, Cloudflare Pages, GitHub Pages

The frontend can be built and deployed independently as a static Single Page Application (SPA).

1. **Build the Static Site**:
   ```bash
   npm run build
   ```
   The production files are output to the `dist/` directory.

2. **Deploy to Vercel**:
   - Connect your Git repository to [Vercel](https://vercel.com).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - The included `vercel.json` automatically configures SPA routing and security headers.

3. **Deploy to Netlify or Cloudflare Pages**:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - The included `public/_redirects` ensures client-side routing works on refresh without 404s.

4. **Connecting to a Remote Backend (Decoupled Architecture)**:
   - When hosting the frontend statically, set the environment variable:
     ```env
     VITE_API_BASE_URL=https://api.yourdomain.com
     ```
   - *Static Resilience Note*: If no remote backend is deployed, the frontend gracefully falls back to local data and still enables direct WhatsApp reservations for guests with generated reference numbers.

---

### Option B: Full-Stack Cloud Hosting (Recommended)
**Providers:** Render, Railway, Fly.io, CapRover

This runs the unified Node.js Express server which handles both the API, database persistence, and serves the optimized frontend bundle.

#### 1. Deploy on Render (render.com)
1. Create a new **Web Service** on Render and connect your Git repository.
2. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `3000`
   - `APP_URL`: `https://your-service.onrender.com` (or custom domain)
   - `ADMIN_PASSWORD`: `<your-secure-password>`
   - `ADMIN_SECRET_KEY`: `<generate-a-32-char-random-string>`
   - `DATABASE_URL`: *(Optional)* Your PostgreSQL database connection string.

#### 2. Deploy on Railway (railway.app)
1. Click **New Project** -> **Deploy from GitHub repo**.
2. Railway will automatically detect Node.js and run the build and start scripts.
3. You can provision a PostgreSQL database in Railway in one click and link `DATABASE_URL` directly.

---

### Option C: Generic VPS / Linux Server
**Providers:** Hostinger VPS, DigitalOcean Droplet, Hetzner, OVH, CapConnect, Nindohost

Follow these steps on Ubuntu 22.04 / 24.04 LTS:

```bash
# 1. Update system and install Node.js 22 & Git
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# 2. Install PM2 (Process Manager) globally
sudo npm install -g pm2

# 3. Clone project and install dependencies
cd /var/www
sudo git clone <your-repo-url> ghorob-chams
cd ghorob-chams
sudo npm install

# 4. Create your production .env file
sudo cp .env.example .env
sudo nano .env

# 5. Build frontend bundle
sudo npm run build

# 6. Start the application with PM2
pm2 start "npm start" --name "ghorob-chams"
pm2 save
pm2 startup
```

#### Nginx Reverse Proxy Configuration:
Edit `/etc/nginx/sites-available/ghorob-chams`:

```nginx
server {
    listen 80;
    server_name ghorob-chams-residence.ma www.ghorob-chams-residence.ma;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site and install free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/ghorob-chams /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ghorob-chams-residence.ma -d www.ghorob-chams-residence.ma
```

---

### Option D: Docker & Docker Compose

Deploy the entire stack (Node.js application + PostgreSQL database with volume persistence) in a single command:

```bash
# 1. Copy and adjust environment variables
cp .env.example .env

# 2. Launch application and PostgreSQL database containers
docker compose up -d --build

# 3. View logs
docker compose logs -f
```

The database volume `pgdata` and media volume `app_data` ensure all data and uploaded photos persist across container updates and host restarts.

---

## 🗄️ Database & Data Portability

The project implements a **portable Data-Access Layer (DAL)** located in `server/storage/`:

```
server/storage/
├── types.ts          # IDataStore interface definition
├── jsonStore.ts      # Local file-based atomic JSON storage (data/database.json)
├── postgresStore.ts  # PostgreSQL relational adapter with auto-migrations
├── seedData.ts       # Initial apartments and settings seed data
└── index.ts          # Storage driver factory
```

### Storage Driver Selection:
1. **PostgreSQL (Production Persistence)**:
   - Configured via `DATABASE_URL`.
   - Compatible with any managed PostgreSQL service: Supabase, Neon, AWS RDS, DigitalOcean, or Railway.
   - On server startup, tables (`gc_settings`, `gc_apartments`, `gc_inquiries`, `gc_admin`, `gc_sessions`) and initial seed data are created automatically if they do not exist.
   - A standalone schema file is also provided in `database.sql`.
2. **Local JSON File (Zero-Config / Development)**:
   - Used when `DATABASE_URL` is omitted.
   - Saves state to `data/database.json` using atomic temporary file swaps to prevent corruption.

> ⚠️ **Persistent Storage Clarification**: 
> - On ephemeral cloud containers (e.g. standard free tiers on Heroku or Render without a persistent disk), local JSON files are reset on container redeployments.
> - For permanent storage of guest booking inquiries, custom apartment edits, and uploaded photos in production, configuring a persistent **PostgreSQL database (`DATABASE_URL`)** or a **persistent volume** is required.

---

## 🖼️ Property Images & Media Storage

- High-resolution coastal assets and floorplans are included in `src/assets/images/`.
- Uploaded media is served from the persistent directory `/uploads` (`data/uploads`).
- **Cloud Object Storage (Optional)**:
  - If deploying to serverless platforms without persistent disk access, you can host property photos on AWS S3, Cloudflare R2, or Supabase Storage and paste the URLs into the apartment image lists in the Owner Portal.

---

## 🔒 Security & Authentication

- **No Hardcoded Passwords**: All default production credentials have been removed.
- **Environment Variables**: Read admin credentials from `ADMIN_PASSWORD` and `ADMIN_SECRET_KEY`.
- **HMAC-SHA256 & Timing-Safe Verification**: Passwords are cryptographically salted and verified using `crypto.timingSafeEqual` to prevent timing attacks.
- **Rate Limiting**:
  - Max 5 admin login attempts per 15 minutes per IP address.
  - Max 15 booking inquiry submissions per hour per IP address.
- **Spam Protection**: Invisible honeypot field catches automated bots without disrupting legitimate guests.
- **CORS Protection**: Configurable allowed origins via `CORS_ORIGIN`.
- **Session Expiration**: 7-day cryptographically random session tokens with automated expiration.

---

## ⚙️ Environment Variables Reference

| Variable | Required? | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Optional | `3000` | Port for the HTTP server |
| `NODE_ENV` | Optional | `development` | `development` or `production` |
| `APP_URL` | Optional | `https://ghorob-chams-residence.ma` | Public URL for sitemap and metadata |
| `DATABASE_URL` | **Recommended in Prod** | *None (uses JSON)* | PostgreSQL connection URI |
| `ADMIN_PASSWORD` | **Recommended in Prod** | *Random in Prod* | Master password for the Owner Portal |
| `ADMIN_SECRET_KEY`| **Recommended in Prod** | *Dev secret* | Salt key for HMAC-SHA256 password hashing |
| `VITE_API_BASE_URL`| Optional (Decoupled) | `""` (Relative) | Backend base URL for static frontend builds |
| `CORS_ORIGIN` | Optional | `*` | Allowed CORS origins (comma-separated) |

---

## 🌐 Connecting Custom Domain & HTTPS

1. **Purchase Domain**:
   - For Moroccan national domain (`.ma`), register via ANRT accredited registrars (e.g. Genious, CapConnect, Nindohost).
   - For generic domains (`.com`, `.net`), register with any standard registrar.
2. **DNS Records**:
   - Create an **A Record** pointing `@` to your server IP address.
   - Create a **CNAME Record** pointing `www` to your main domain or hosting alias.
3. **HTTPS / SSL**:
   - Vercel, Netlify, Render, and Cloudflare automatically provision free SSL certificates.
   - For VPS deployments, use Let's Encrypt via `certbot --nginx`.

---

## 📞 Business Contact

- **Property**: إقامة غروب شمس | Ghorob Chams Residence
- **Location**: Coastal Road, Briech (10 km north of Asilah), Tangier-Tetouan-Al Hoceima, Morocco
- **WhatsApp Reservation**: `+212 638 19 49 95` (`212638194995`)
- **Direct Link**: [Chat on WhatsApp](https://wa.me/212638194995)
