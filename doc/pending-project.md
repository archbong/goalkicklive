Got it ✅ — I’ll extend the `README.md` to include:

1. **Pending Work (short-term)** → immediate tasks.
2. **Next Phase (mid-term)** → the stage we’re about to enter.
3. **Remaining Phases (long-term)** → everything needed until the app is product-ready & marketable.

Here’s the improved draft:

---

# ⚽ Football Highlights App (Scorebat + Next.js + Redis)

## 📖 Overview

This app fetches football highlights from **Scorebat API**, stores them in **Redis** (Upstash), and exposes them via **Next.js API routes**.

* **Data source:** [Scorebat Video API](https://www.scorebat.com/video-api/)
* **Cache/DB:** Upstash Redis
* **Framework:** Next.js 13+ (App Router)

---

## 📂 Project Structure

```
lib/
  ├─ redis.ts           # Redis client
  ├─ cache.ts           # Cache helpers
  ├─ videoIndexer.ts    # Save videos to Redis JSON
  ├─ videoIngestor.ts   # Fetch + index Scorebat videos
app/
  ├─ api/
     ├─ videos/route.ts # Get paginated videos
     ├─ ingest/route.ts # Trigger ingestion manually
```

---

## ⚙️ Setup

1. Add env vars:

```env
REDIS_URL=...
REDIS_TOKEN=...
SCOREBAT_API_KEY=...
```

2. Install dependencies:

```bash
npm install @upstash/redis
```

---

## 🚀 API Endpoints

### Get Videos

```http
GET /api/videos?page=1&limit=10
```

Returns paginated highlights (cached in Redis).

### Ingest Videos

```http
POST /api/ingest
```

Fetches videos from Scorebat and stores them in Redis JSON.

Example response:

```json
{ "success": true, "count": 50 }
```

---

## 🏗 Pending Work (Current Sprint)

* [ ] Automate ingestion:

  * Use **Vercel Cron Jobs** (preferred) or Upstash QStash.
* [ ] Add error handling + retries for API failures.
* [ ] Prevent duplicate videos in Redis (idempotent ingestion).

---

## 🔜 Next Phase (Phase 4: Search, Feeds & Indexing)

* Implement **Redis full-text search** (title, teams, competition).
* Add **filter by competition, date, team**.
* Build **feed endpoints**:

  * `/api/feed/recent` → latest highlights
  * `/api/feed/competition/:slug` → by competition
* Optimize queries with Redis indexes.

---

## 🏆 Remaining Phases (Toward Production-Ready App)

### Phase 5: Web UI (Next.js Frontend)

* Landing page with highlights feed.
* Video cards (title, embed iframe, competition, date).
* Search & filters (competition, team, recency).
* Pagination or infinite scroll.

### Phase 6: Mobile (Flutter App)

* Same functionality as web feed.
* Consume `/api/videos` and `/api/feed/...` endpoints.
* Local caching for offline viewing.

### Phase 7: Auth & Personalization

* Optional: user login (NextAuth or Supabase).
* Save favorites/bookmarks.
* Personalized feed (follow teams/competitions).

### Phase 8: Observability & Security

* Logging & monitoring (Vercel + Sentry).
* Rate limiting (Upstash Ratelimit).
* Secure CORS setup for web + mobile.

### Phase 9: Deployment & Market-Readiness

* Finalize CI/CD (GitHub Actions + Vercel).
* Optimize Redis usage for cost + performance.
* Prepare documentation & marketing site.
* Launch MVP.

---

✍️ **Next Step for you tomorrow**:
We’re about to start **Phase 4: Search & Feed APIs**.

---


