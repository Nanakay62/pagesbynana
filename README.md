# Pages by Nana

> A fast, elegant, distraction-free fiction publishing website for original books and serialized stories by **Nana Kwame Dickson**.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, **TipTap**, **Mammoth.js**, **Supabase**, and **Resend**.

---

## ✨ Features & Architecture

### 📖 The Reading Experience (The Core Product)
- **Distraction-Free Typography:** Built using Google Fonts (*Fraunces* for editorial serif titles, *Literata* for prose, *Inter* for interface clarity, and *Atkinson Hyperlegible* for dyslexia accessibility).
- **Four Curated Themes:** Warm Cream / Sepia (`#FBF8F3`), Editorial Light (`#FFFFFF`), Deep Night Dark (`#181513`), and System Auto mode.
- **Reader Customization Drawer:** Instant font size adjustment (4 steps), line height toggle (relaxed vs. compact), and optional literary drop cap.
- **Reading Progress & Smart Resume:** Automatically tracks scroll position in `localStorage` and provides a "Continue reading" button on the book page and library.
- **Instant Next-Chapter Prefetching:** The next chapter is pre-rendered and prefetched invisibly via Next.js router for 0ms page transitions.
- **Offline PWA & Service Worker:** Full Progressive Web App manifest (`manifest.webmanifest`) and network-first service worker (`/sw.js`) that caches visited book chapters for offline airplane/subway reading.
- **Full Book Offline Export:** Readers can download an entire book as a **Standalone Single-File HTML Reader** (styled and portable) or **Clean Markdown (`.md`)**.

---

### ✍️ Author Publishing & Word Import (.docx)
- **Automated Word Document Splitter:** Upload a standard Microsoft Word `.docx` manuscript. The custom Mammoth.js parser splits chapters automatically by `Heading 1` or `Heading 2`, cleans formatting, and converts asterisks (`***`, `* * *`) into literary scene break dividers (`<div class="scene-break"></div>`).
- **Interactive Import Staging:** Preview split chapters, edit titles, reorder with up/down controls, merge fragments, and batch-create drafts with one click.
- **Distraction-Free TipTap Editor:**
  - Minimal contextual toolbar (Bold, Italic, Headings, Blockquotes, Links).
  - One-click **Scene Break Ornament (`✦ ✦ ✦`)** inserter.
  - Fullscreen Zen Mode (hides navigation and distractions).
  - Real-time Word Count and Estimated Reading Time.
  - Automatic background autosave with visual status indicator.
  - **Version History Drawer:** Automatically takes snapshots while writing with 1-click restore.
  - **Publishing Scheduler:** Schedule chapters for future release or publish immediately with an optional "Notify readers" email broadcast.

---

### 📊 Privacy-First Analytics & Monetization
- **Zero-Cookie Event Beacon:** Compliant with GDPR/ePrivacy without invasive banners. Tracks `book_open`, `chapter_read`, `chapter_complete` (>90% scroll depth), and `donate_click` using an anonymous browser-session token.
- **Author Dashboard:** Real-time metrics on total reads, completion rate, geographic reader distribution, and discovery channels.
- **Paystack & Mobile Money Support:** Dedicated `/support` page configured for Ghana Mobile Money (MTN MoMo, Telecel Cash, AT Money) and debit/credit cards via Paystack, with fallback to Ko-fi.

---

### 📬 Double Opt-In Email Newsletter
- **Resend Integration:** Reliable, transactional delivery for chapter notifications.
- **Double Opt-In Flow:** Submitting an email generates a secure verification token and dispatches a warm confirmation email (`/subscribe/confirm?token=...`).
- **1-Click Unsubscribe:** Fully compliant unsubscribe route (`/unsubscribe?token=...`).
- **Automated Publishing Cron:** `/api/cron/publish` checks for scheduled chapters, flips them to published, and automatically notifies subscribers.
- **Subscriber Management Dashboard:** View active readers, pending verifications, export CSV, and send manual test previews or releases directly from `/admin/subscribers`.

---

### 🌐 SEO & Syndication
- **Schema.org Structured Data:** Valid JSON-LD `Book` schema on book pages and `Chapter` schema on reading pages.
- **RSS 2.0 Feeds:**
  - Site-wide feed: `https://pagesbynana.com/rss.xml`
  - Per-book feed: `https://pagesbynana.com/books/[slug]/rss.xml`
- **Dynamic XML Sitemap:** Automatically generated at `/sitemap.xml`.
- **OpenGraph & Twitter Card Metadata:** Configured per-book and per-chapter.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- npm or pnpm

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/pages-by-nana.git
cd pages-by-nana
npm install
```

### 2. Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Fill in your secrets:
```env
# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Author Admin Access
ADMIN_EMAIL=nanakwamedickson@outlook.com

# Supabase (PostgreSQL & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email Delivery
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=Pages by Nana <updates@pagesbynana.com>

# Automated Publishing Cron Secret
CRON_SECRET=your-random-cron-secret

# Support & Donations
NEXT_PUBLIC_PAYSTACK_PAY_URL=https://paystack.com/pay/pagesbynana
NEXT_PUBLIC_KOFI_URL=https://ko-fi.com/nanakwamedickson
```

> **Note on Local Development without external services:**
> If `SUPABASE_URL` or `RESEND_API_KEY` are not set, the platform automatically runs in graceful local mode using high-fidelity in-memory sample data and logged email dispatch previews.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🗄️ Database Setup (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the schema migration script:
   - File: `supabase/migrations/01_initial_schema.sql`
4. (Optional) Run the seed script to populate sample books:
   - File: `supabase/seed.sql`

The migration sets up Row Level Security (RLS) policies allowing public read access for published books and restricting mutation to the author's admin email.

---

## ☁️ Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables defined above in the Vercel project settings.
4. Set up Vercel Cron for automated chapter publishing:
   Add `vercel.json` (already included):
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/publish",
         "schedule": "*/15 * * * *"
       }
     ]
   }
   ```
5. Deploy!

---

## 🔒 Admin Access
- Navigate to `/admin` or `/admin/login`.
- Enter the configured author email (`nanakwamedickson@outlook.com`).
- A secure login link or session is created, granting access to:
  - Manuscript Importer (`/admin/import`)
  - Books & Chapters Manager (`/admin/books`)
  - TipTap Chapter Editor (`/admin/chapters/[id]`)
  - Subscribers & Broadcasts (`/admin/subscribers`)
  - Site Settings (`/admin/settings`)

---

## 📄 License
All literary content, stories, and manuscripts © Nana Kwame Dickson. All rights reserved.
Website source code is open under the MIT License.
