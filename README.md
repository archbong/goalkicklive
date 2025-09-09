# **Football Highlight – Project README**

## **📌 Overview**

**Football Highlight** is a global platform for football fans to watch highlights, follow live matches, and stay updated with football news and competitions worldwide.
This project is built with **Next.js 15 (App Router)** to ensure performance, scalability, and maintainability from MVP to global scale.

The mobile app already exists (built with Flutter) and this website will serve as:

* A **web version** for global users.
* A **marketing & legal hub** to attract, inform, and protect users.
* A **foundation** for future features like live streaming, news, user accounts, and community engagement.

---

## **🗂 Project Structure**

The structure follows **Next.js App Router conventions** with clear separation of concerns for **pages**, **components**, and **utilities**.

```
project-root/
│
├── app/                        # Next.js App Router pages
│   ├── layout.tsx               # Global layout (Navbar, Footer, etc.)
│   ├── page.tsx                 # Home page
│   ├── highlights/              # Match highlights
│   ├── privacy-policy/          # Privacy Policy
│   ├── terms-and-conditions/    # Terms & Conditions
│   ├── contact/                 # Contact Us
│   ├── about/                   # About Football Highlight
│   ├── download/                # Download App Links
│   ├── not-found.tsx             # 404 Page
│   ├── dashboard/                # (Future) User Dashboard
│   ├── live-matches/             # (Future) Live Streams
│   ├── news/                     # (Future) Football News
│   ├── advertisers/              # (Future) Ad Partnership
│   ├── careers/                  # (Future) Job Listings
│   ├── help/                     # (Future) Help Center / FAQ
│   ├── community/                # (Future) User Forum
│   └── legal/                    # (Future) GDPR, CCPA, Cookies
│
├── components/                   # Shared UI Components
│   ├── layout/                   # Layout elements
│   ├── ui/                       # Reusable UI elements
│   ├── video/                    # Video player components
│   ├── ads/                      # Advertising slots
│   ├── analytics/                # Analytics tracking hooks
│   └── language/                 # Multi-language support
│
├── lib/                          # Utilities & API functions
├── public/                       # Static assets
├── styles/                       # Global styles
```

---

## **📄 Pages & Purpose**

- **Home Page** — App intro, core value proposition, download links.

- **Features** — Highlight what users can do (e.g., watch highlights, live matches, stats).

- **Download Page** — Direct links to app store, Google Play, or APK.

- **Feedback** / Contact Form — For early user feedback.

- **Blog / Updates** — To post announcements & improvements.

- **Privacy Policy (placeholder)** — Will expand later, but enough to say “We’re working on our full policy” + contact email.

- **Terms & Conditions (placeholder)** — Minimal version now, detailed later.

- **Settings & Support Page — FAQ + quick help**.

---

## **🧩 Components & Purpose**

**Navigation & Layout**

- Header / Navbar

- Footer

- Sidebar (optional for dashboard)

- Responsive Layout Wrapper

- Mobile Menu Drawer

**UI Components**

- Button Variants (Primary, Secondary, Outline)

- Card Component (for match highlights, news, etc.)

- Modal / Dialog

- Tabs

- Accordion

- Search Bar

- Pagination / Infinite Scroll

- Loader / Spinner

- Toast Notifications

- Tooltip

- Icon Component (centralized icons)

**Forms & Inputs**

- Text Field

- Text Area

- Select Dropdown

- Radio / Checkbox

- Toggle Switch

- File Upload (future: profile pictures, etc.)

**Specialized Components**

- Video Player Wrapper (reusable for highlights & future live matches)

- Ad Slot Component (Google Ad Manager / custom ads)

- Analytics Tracker Hook (centralized)

- Language Selector (for international users)

- Cookie Consent Banner

**Video Components**

- VideoPlayer.tsx – Embed highlights/live streams.

**Ads Components**

- AdSlot.tsx – Google Ad Manager or custom ads integration.

**Analytics Components**

- AnalyticsTracker.tsx – Custom tracking for clicks, video plays, etc.

**Language Components**

LanguageSelector.tsx – Multi-language support.
---

## **📊 Feature Specification Table**

| Feature / Page                  | Description / Purpose                                                | MVP | Future Phase                       |
| ------------------------------- | -------------------------------------------------------------------- | --- | ---------------------------------- |
| **Home Page**                   | Showcase featured highlights, quick links, and download app banners. | ✅   | Enhancements with personalization  |
| **Highlights**                  | List and play match highlights with filters.                         | ✅   | AI-based recommendations           |
| **Privacy Policy**              | Legal document explaining data usage.                                | ✅   | Auto-update from compliance system |
| **Terms & Conditions**          | Rules and disclaimers for users.                                     | ✅   | Multi-language versions            |
| **Contact Us**                  | Contact form, email, and socials.                                    | ✅   | Live chat support                  |
| **About**                       | Brand story, mission, team intro.                                    | ✅   | Interactive timeline               |
| **Download**                    | Links to app stores + QR code.                                       | ✅   | App version update checker         |
| **404 Page**                    | Friendly not-found page.                                             | ✅   | Fun football-themed graphics       |
| **Dashboard**                   | Personalized feed, saved highlights.                                 | ❌   | ✅                                  |
| **Live Matches**                | Embedded live streams, score updates.                                | ❌   | ✅                                  |
| **News**                        | Football news aggregator.                                            | ❌   | ✅                                  |
| **Advertisers**                 | Info for brands to advertise on platform.                            | ❌   | ✅                                  |
| **Careers**                     | Job listings and application forms.                                  | ❌   | ✅                                  |
| **Help Center**                 | FAQs, troubleshooting guides.                                        | ❌   | ✅                                  |
| **Community**                   | Fan forum & discussion boards.                                       | ❌   | ✅                                  |
| **Legal Pages**                 | GDPR, CCPA, Cookie Consent.                                          | ❌   | ✅                                  |
| **Language Selector Component** | Switch between supported languages.                                  | ❌   | ✅                                  |
| **Ad Slots**                    | Areas for ads (Google Ad Manager).                                   | ✅   | Expansion to dynamic placements    |
| **Analytics Tracker**           | Logs user actions for insights.                                      | ✅   | Machine learning analysis          |
| **Video Player**                | Optimized highlight playback.                                        | ✅   | Multi-angle replays                |

---

## **⚙ Libraries & Tech Stack**

* **Next.js 15** – Full-stack React framework with App Router.
* **TypeScript** – Static typing.
* **Tailwind CSS** – Utility-first styling.
* **Shadcn/UI** – Pre-built accessible components.
* **Next Auth (future)** – Authentication.
* **Google Tag Manager** – Ad & analytics tracking.
* **Custom API Layer** – Highlights, live matches.

---

## **🚀 Development Phases**

1. **MVP** – Home, Highlights, Privacy Policy, Terms, Contact, About, Download.
2. **Phase 2** – Live Matches, News, Advertisers.
3. **Phase 3** – Dashboard, Community, Help Center.
4. **Phase 4** – Multi-language, global compliance.


## Apis for supersport
https://supersport.com/apix
https://supersport.com/apix/content
https://supersport.com/apix/content/v5
https://supersport.com/apix/content/v5.1
https://supersport.com/apix/content/v5.1/indaleko-web
https://supersport.com/apix/content/v5.1/indaleko-web/curatedfavourites
https://supersport.com/apix/content/v5/countries
https://supersport.com/apix/football
https://supersport.com/apix/football/v5.1
https://supersport.com/apix/football/v5.1/feed
https://supersport.com/apix/football/v5.1/feed/score
https://supersport.com/apix/football/v5.1/feed/score/summary
https://supersport.com/apix/football/v5.1/feed/score/summary?pageSize=10&eventStatusIds=1,2&startDate=1757372400&endDate=1757458799&orderAscending=true&region=de&platform=indaleko-web
https://supersport.com/apix/guide/v5.3/livenow
https://supersport.com/apix/guide/v5.3/livenow?countryCode=de&live=true
https://supersport.com/apix/guide/v5.3/livenow?countryCode=nl&live=true
https://supersport.com/apix/guide/v5.3/livenow?sport=football&countryCode=de&live=true


## APIs for scorebat
ENDPOINTS
You can retrieve the embed codes of the videos in JSON format from the following endpoints:

Recent Feed
https://www.scorebat.com/video-api/v3/feed/?token=[YOUR_API_TOKEN]

Competition
https://www.scorebat.com/video-api/v3/competition/england-premier-league/?token=[YOUR_API_TOKEN]

Team
https://www.scorebat.com/video-api/v3/team/real-madrid/?token=[YOUR_API_TOKEN]
