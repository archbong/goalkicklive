# **Goalkick Live – Project README**

## **📌 Overview**

**Goalkick Live** is a simple business website that promotes our mobile application for live football match streaming. This website serves as a marketing hub to inform users about our mobile app and provide essential business information.

The mobile app (built with Flutter) provides live football match streaming, and this website serves as:

* A **marketing platform** to attract and inform users about our mobile app
* A **business information hub** with company details and contact information
* A **download portal** for accessing the mobile app on iOS and Android

---

## **🗂 Project Structure**

The structure follows **Next.js App Router conventions** with clear separation of concerns.

```
project-root/
│
├── app/                        # Next.js App Router pages
│   ├── layout.tsx               # Global layout
│   ├── page.tsx                 # Home page (redirect)
│   ├── [locale]/                # Localized pages
│   │   ├── layout.tsx           # Localized layout
│   │   ├── page.tsx             # Localized home page
│   │   ├── downloads/           # App download links
│   │   ├── privacy-policy/      # Privacy Policy
│   │   ├── terms-and-conditions/# Terms & Conditions
│   │   ├── about/               # About Goalkick Live
│   │   ├── contact/             # Contact Us
│   │   └── settings/            # User settings
│   ├── api/                     # API routes
│   │   ├── admin/               # Admin endpoints
│   │   ├── analytics/           # Analytics tracking
│   │   ├── health/              # Health checks
│   │   └── providers/           # Service providers
│   ├── prisma/                  # Database schema
│   ├── scripts/                 # Build scripts
│   └── styles/                  # Global styles
│
├── components/                  # Shared UI Components
│   ├── layout-components/       # Layout elements (Navbar, Footer, etc.)
│   ├── ui/                      # Reusable UI elements (Button, etc.)
│   ├── monitoring/              # Monitoring components
│   └── LocaleSwitcher.tsx       # Language switcher
│
├── lib/                         # Utilities & API functions
├── public/                      # Static assets
├── locales/                     # Translation files
└── i18n/                        # Internationalization config
```

---

## **📄 Pages & Purpose**

- **Home Page** — Promotes the mobile app with key features, testimonials, and download calls-to-action
- **Download Page** — Direct links to App Store, Google Play Store, and QR codes
- **About Page** — Company information, mission, and team details
- **Contact Page** — Contact form, email, and social media links
- **Privacy Policy** — Data usage and privacy information
- **Terms & Conditions** — App usage terms and conditions
- **Settings Page** — User preferences and app settings

---

## **🧩 Components & Purpose**

**Navigation & Layout**
- Header / Navbar
- Footer
- MainLayout wrapper
- Mobile Menu Drawer

**UI Components**
- Button Variants (Primary, Secondary, Outline)
- Container for consistent spacing
- Responsive design components

**Specialized Components**
- LocaleSwitcher for international users
- Analytics tracking components
- Monitoring components for system health

---

## **📱 Mobile App Features**

Our mobile application provides:

### **Core Features**
- **Live Match Streaming**: Watch live football matches from top leagues worldwide
- **Mobile Optimized**: Designed specifically for mobile devices with intuitive controls
- **Global Coverage**: Access matches from Premier League, La Liga, Serie A, Bundesliga, and more
- **Real-time Updates**: Live scores, match statistics, and instant notifications
- **Secure & Reliable**: Secure streaming with minimal buffering and high uptime
- **Free Download**: Available for free on iOS and Android

### **Platform Support**
- iOS 12+ (App Store)
- Android 8+ (Google Play Store)

---

## **⚙ Libraries & Tech Stack**

* **Next.js 15** – Full-stack React framework with App Router
* **TypeScript** – Static typing for better developer experience
* **Tailwind CSS** – Utility-first styling framework
* **Internationalization** – Multi-language support
* **Google Tag Manager** – Analytics and tracking integration

---

## **🚀 Development Setup**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

---

## **🎯 Business Goals**

1. **User Acquisition** – Drive mobile app downloads through effective marketing
2. **Brand Awareness** – Establish Goalkick Live as a trusted football streaming platform
3. **User Support** – Provide essential information and support channels
4. **Legal Compliance** – Maintain necessary legal documentation and policies

---

## **📞 Contact & Support**

For business inquiries, technical support, or partnership opportunities:
- Email: contact@goalkicklive.com
- Website: https://goalkicklive.com
- Social Media: @goalkicklive

---

## **📄 License**

© 2024 Goalkick Live. All rights reserved.