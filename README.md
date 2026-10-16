# إقامة غروب شمس | Ghorob Chams Residence

A complete, professional, mobile-first real estate and holiday rental website for **Ghorob Chams Residence (إقامة غروب شمس)**, located in **Briech**, approximately 10 km north of **Asilah**, Morocco, along the Atlantic coast.

---

## 🌟 Key Features

1. **Multilingual Architecture**
   - **English**, **French (Français)**, and **Arabic (العربية)** with automatic right-to-left (`dir="rtl"`) layout and authentic Moroccan typography.
   - Fluid language switcher in top navigation and mobile drawer.

2. **Moroccan Coastal Visual Design**
   - Color palette inspired by the northern Atlantic coast: deep ocean blue, turquoise, sunset orange, and clean whitewashed sand tones.
   - Bespoke residence logo emblem depicting golden sunset, sea waves, and architectural balconies.
   - High-fidelity coastal imagery capturing Briech beach, Atlantic sunsets, and contemporary furnished interiors.
   - Anti-misrepresentation compliance: sample demo listings are clearly badged with demo notices.

3. **Apartment Listings System**
   - Detailed property pages with image galleries, bedroom/bathroom counts, maximum guest capacity, area ($m^2$), floor level, and amenity checklists (WiFi, equipped kitchen, AC, parking, TV).
   - Dynamic stay cost calculation based on check-in and check-out dates.
   - Filter listings by bedrooms, guest count, and sea view.

4. **Booking Inquiries & WhatsApp Integration**
   - Validated booking inquiry form with anti-spam honeypot protection.
   - Instant inquiry reference generation (e.g. `GC-849201`).
   - Direct click-to-chat WhatsApp button with pre-filled multilingual messages.
   - Floating WhatsApp reservation widget.

5. **Property Management Dashboard (Owner Portal)**
   - Secure administrator authentication via session tokens.
   - **Manage Apartments**: Add, edit, or delete listings; adjust nightly & monthly prices; toggle sea view, balcony, and availability status (`available`, `reserved`, `maintenance`).
   - **Booking Inquiries**: View all received guest inquiries, filter by status (`New`, `Contacted`, `Confirmed`, `Cancelled`), and contact guests directly via WhatsApp in one click.
   - **Website Settings**: Configure the reservation WhatsApp number, public phone, email, check-in/out times, and change admin password.

6. **SEO & Social Sharing**
   - OpenGraph and Twitter Cards metadata for rich WhatsApp and Facebook sharing.
   - Dynamic `sitemap.xml` and `robots.txt` served from the Express backend.
   - Schema.org structured data (`LodgingBusiness` / `VacationRental`).
   - Keyword optimization for Briech, Asilah, and northern Morocco holiday rentals.

---

## 🚀 Running the Project

### Development
```bash
npm run dev
```
Starts the full-stack server on `http://localhost:3000` with Express API routes mounted alongside Vite dev middleware.

### Production Build
```bash
npm run build
npm start
```

---

## 🔐 Administrator Dashboard Access

- **Route**: Navigate to the Owner Portal via the shield icon in the top navigation or the footer link.
- **Default Setup Password**: `GhorobChams2026!`
- **Security Note**: You can change this password immediately in the dashboard under **Website & Contact Settings** -> **Change Administrator Password**.

---

## 📁 Project Structure

```
├── data/
│   └── database.json          # Persistent file-based store for apartments, inquiries, and settings
├── src/
│   ├── assets/images/         # High-resolution coastal & apartment assets
│   ├── components/
│   │   ├── ApartmentCard.tsx  # Property preview card with unboxed metadata
│   │   ├── BookingModal.tsx   # Reservation inquiry modal with live calculator
│   │   ├── Footer.tsx         # Quiet footer with links & contact info
│   │   ├── Logo.tsx           # Bespoke vector logo emblem
│   │   ├── Navbar.tsx         # Top Bar Contract compliant navigation
│   │   └── WhatsAppFloatingButton.tsx # Quick WhatsApp booking button
│   ├── data/
│   │   ├── initialData.ts     # Initial seed data for apartments and settings
│   │   └── translations.ts    # Comprehensive EN, FR, AR dictionary
│   ├── views/
│   │   ├── AboutView.tsx
│   │   ├── AdminDashboardView.tsx
│   │   ├── ApartmentDetailView.tsx
│   │   ├── ApartmentsView.tsx
│   │   ├── ContactView.tsx
│   │   ├── GalleryView.tsx
│   │   ├── HomeView.tsx
│   │   ├── LocationView.tsx
│   │   ├── NotFoundView.tsx
│   │   ├── PrivacyPolicyView.tsx
│   │   └── TermsView.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
├── index.html                 # SEO meta tags, Google Fonts & Schema.org JSON-LD
├── metadata.json              # Applet metadata
├── package.json
├── server.ts                  # Express full-stack backend & persistent API
└── vite.config.ts
```

---

## ⚙️ Configuration & Production Deployment

1. **WhatsApp Reservation Number**: Open the Admin Dashboard -> Settings -> set your active WhatsApp number in international format (e.g., `2126XXXXXXXX` without `+` or spaces).
2. **Domain Name**: Host on any Node.js provider (Google Cloud Run, Railway, Render, VPS) by setting `PORT=3000` and `APP_URL=https://your-domain.com`.
3. **Online Payments**: By design, no fake online payment gateway is enabled. When ready, integration with a Moroccan payment provider (e.g., CMI, PayZone) or international processors (Stripe) can be added to the booking flow.
