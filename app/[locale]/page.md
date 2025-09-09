# **Football Pages – Pages README**


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

```

---

## **📄 Pages & Purpose**

### **1. Home Page (`/`)**

* **Purpose:** First touchpoint for visitors.
* **Content:**

  * Hero banner with call-to-action (Watch Highlights / Download App).
  * Featured matches and highlights.
  * Links to download the mobile app.
  * Quick links to live matches and news (when available).

---

### **2. Highlights Page (`/highlights`)**

* **Purpose:** Showcase recent football match highlights.
* **Content:**

  * Match thumbnails, titles, and competitions.
  * Filters by date, competition, or team.
  * Embedded video player for playback.

---

### **3. Privacy Policy (`/privacy-policy`)**

* **Purpose:** Inform users how their data is collected, stored, and used.
* **Content:**

  * Data collection policies.
  * Cookie usage.
  * Third-party services (ads, analytics, etc.).

---

### **4. Terms & Conditions (`/terms-and-conditions`)**

* **Purpose:** Define the rules for using the platform.
* **Content:**

  * User rights and responsibilities.
  * Intellectual property ownership.
  * Disclaimers and limitations.

---

### **5. Contact Us (`/contact`)**

* **Purpose:** Let users, advertisers, and partners reach out.
* **Content:**

  * Contact form.
  * Business email & phone number.
  * Social media links.

---

### **6. About Page (`/about`)**

* **Purpose:** Present the brand story.
* **Content:**

  * Mission & vision.
  * Team introduction.
  * Product journey.

---

### **7. Download Page (`/download`)**

* **Purpose:** Direct users to the mobile app stores.
* **Content:**

  * Download buttons (Google Play, App Store).
  * QR code for quick install.

---

### **8. 404 Page (`/not-found`)**

* **Purpose:** User-friendly error page.
* **Content:**

  * Message + link to return home.

---

### **Future Pages (Placeholders)**

* **Dashboard** – Personalized match feeds & saved videos.
* **Live Matches** – Embedded live streams.
* **News** – Latest football news & updates.
* **Advertisers** – Information for brands & sponsors.
* **Careers** – Job postings.
* **Help Center** – FAQs, troubleshooting.
* **Community** – Fan discussions.
* **Legal** – GDPR, CCPA, Cookie consent.

---

## **⚙ Libraries & Tech Stack**

* **Next.js 13+** – Full-stack React framework.
* **TypeScript** – Type safety.
* **Tailwind CSS** – Styling.
* **Shadcn/UI** – Accessible components.
* **Next Auth (future)** – Authentication.
* **Google Tag Manager** – Ad & analytics tracking.
* **Custom API layer** – For highlights, live matches.

---

## **🚀 Development Phases**

1. **MVP** – Home, Highlights, Privacy Policy, Terms, Contact, About, Download.
2. **Phase 2** – Live Matches, News, Advertisers.
3. **Phase 3** – Dashboard, Community, Help Center.
4. **Phase 4** – Multi-language, global compliance.