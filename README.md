# **Goalkick Live – Project README**

## **📌 Overview**

**Goalkick Live** is a simple business website that promotes our mobile application for live football match streaming. This website serves as a marketing hub to inform users about our mobile app, provide essential business information, and generate revenue through ad placements.

The mobile app (built with Flutter) provides live football match streaming, and this website serves as:

* A **marketing platform** to attract and inform users about our mobile app
* A **business information hub** with company details and contact information
* A **download portal** for accessing the mobile app on iOS and Android
* A **revenue generation platform** through strategic ad placements

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
├── i18n/                        # Internationalization config
├── config/                      # Configuration files
│   └── ads.ts                   # Ad configuration
└── components/ads/              # Ad components
    ├── AdSlot.tsx               # Individual ad slot component
    ├── AdManager.tsx            # Ad placement manager
    ├── AdBanner.tsx             # Banner ad component
    └── index.ts                 # Component exports
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

## **📢 Ad Integration**

The website includes comprehensive ad integration with the following features:

### **Ad Components**
- **AdSlot**: Flexible ad component supporting multiple formats and networks
- **AdManager**: Manages multiple ad placements with priority-based rendering
- **AdBanner**: Pre-configured banner ads for common positions with closable functionality
- **BetweenContentAd**: Ads placed between content sections

### **Supported Ad Networks**
- **Google AdSense**: Full integration with responsive ads
- **Custom Ads**: Support for custom ad content and sponsorships
- **Placeholder Ads**: Development and testing ads

### **Ad Formats**
- **Leaderboard** (728x90): Top and bottom of page banners
- **Rectangle** (300x250): Between content sections
- **Large Rectangle** (336x280): Featured content areas
- **Skyscraper** (120x600): Sidebar placements
- **Mobile Banner** (320x100): Mobile-optimized ads
- **Fluid**: Responsive ads that adapt to container size

### **Closable Ad Feature**
All ad banners now support user-closable functionality to improve user experience:
- **closable** (boolean): Enable/disable close button (default: false)
- **closeButtonDelay** (number): Seconds before close button appears (default: 0)
- **showCloseLabel** (boolean): Show "Close ad" text label (default: false)
- **onClose** (function): Callback when user closes the ad

**Usage Examples:**
```tsx
// Basic closable banner
<TopBanner closable={true} />

// With delay and label
<BottomBanner closable={true} closeButtonDelay={5} showCloseLabel={true} />

// With tracking callback
<InlineAd
  closable={true}
  onClose={() => analytics.track('ad_closed')}
/>
```

### **Ad Placements**
- **Top Banner**: Above page header (now closable)
- **Between Content**: Strategically placed between content sections (now closable)
- **Bottom Banner**: Below page footer (now closable)
- **Sidebar Ads**: Right-hand sidebar placements (desktop only) (now closable)
- **Sticky Mobile Ads**: Bottom-sticky ads for mobile users (now closable)

### **Configuration**
Ad settings are managed through environment variables and the `config/ads.ts` file:
- Enable/disable ads globally
- Configure Google AdSense client ID
- Set ad limits and refresh intervals
- Configure ad blocker detection
- Manage privacy compliance (GDPR/CCPA)

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
* **Google AdSense** – Ad serving and monetization
* **Custom Ad Components** – Flexible ad placement system

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

4. **Configure ads (optional):**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your AdSense client ID and ad settings
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
5. **Revenue Generation** – Monetize traffic through strategic ad placements

---

## **📞 Contact & Support**

For business inquiries, technical support, or partnership opportunities:
- Email: contact@goalkicklive.com
- Website: https://goalkicklive.com
- Social Media: @goalkicklive

---

## **📄 License**

## **💰 Monetization Strategy**

The website implements a balanced ad monetization strategy:

### **Ad Placement Strategy**
- **Non-intrusive placements**: Ads are placed strategically without disrupting user experience
- **Content-relevant ads**: Football and sports-related ad targeting
- **Responsive design**: Ads adapt to different screen sizes and devices
- **Frequency capping**: Limits on ad frequency to prevent user fatigue

### **Revenue Optimization**
- **Multiple ad networks**: Support for Google AdSense and custom sponsorships
- **Performance tracking**: Analytics for ad clicks and impressions
- **A/B testing**: Testing different ad placements and formats
- **Seasonal targeting**: Football season-specific ad campaigns

### **User Experience Considerations**
- **Ad blocker detection**: Polite messages for users with ad blockers
- **Privacy compliance**: GDPR and CCPA compliant ad serving
- **Loading optimization**: Async ad loading to prevent page slowdown
- **Mobile optimization**: Special ad formats for mobile devices

### **Getting Started with Ads**
1. **Sign up for Google AdSense** at https://www.google.com/adsense
2. **Get your publisher ID** (starts with `ca-pub-`)
3. **Update environment variables** in `.env.local`:
   ```
   NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=ca-pub-xxxxxxxxxxxxxxx
   NEXT_PUBLIC_GOOGLE_ADSENSE_ENABLED=true
   ```
4. **Test ad placements** in development mode
5. **Monitor performance** through AdSense dashboard

---

© 2024 Goalkick Live. All rights reserved.