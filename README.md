# TechInHausa Newsletter Website

An elegant, editorial publication website designed for **TechInHausa**, built to match the clean aesthetic of [UrduAI Blog](https://urduai.org/blog/) with official **TechInHausa** brand identity and automated Substack content integration.

---

## Brand Specification

- **Primary Navy Blue:** `#233A69` (Dark Navy: `#162646`)
- **Accent Golden Yellow:** `#D4A03B` / `#F1CC11` (Hover: `#C29030`, Light tint: `#FEF8EE`)
- **Framing Lines:** `#B9CBE2` (Exact color sampled from editorial reference sample)
- **WhatsApp Green:** `#25D366` (Applied strictly to the sticky community footer bar and WhatsApp share button)
- **Typography:**
  - **Headlines:** `Newsreader` (Editorial Serif)
  - **Body / Interface:** `Plus Jakarta Sans` (Clean geometric Sans-serif)

---

## Core Features

1. **Substack Backend Connection:**
   - Client-side and server-side automated ingestion from Substack RSS (`https://techinhausa.substack.com/feed` with fallback to `https://newsletter.techinhausa.org/feed`).
   - Automatic classification of incoming posts into the 5 core categories (`Non-technical`, `AI update`, `Practical guide`, `Stories`, `Ads`).
   - Replaces placeholder showcase posts with live Substack articles once connected.
2. **Editorial Hero & Key Metrics:**
   - Clean, minimalist hero aligned to the `max-w-3xl` editorial column.
   - Exact audience metrics strip:
     - **500K+ Audience**
     - **70K+ Community**
     - **100% Free**
     - **1K App Downloads**
   - Direct Substack email subscription form.
3. **TechInHausa Impact Banner (Bottom Section):**
   - Soft blue framing lines (`#B9CBE2`) above and below.
   - Yellow button: `TechInHausa Impact ↗` linking to `https://techinhausa.org/`.
   - Editorial serif text: `Learn about our work in the community.` with interactive golden hover effect.
4. **TechInHausa LLM Feature:**
   - Header button: `TechInHausa LLM` with `Soon` badge.
   - Opens an interactive "Coming Soon" modal introducing the Hausa AI language model with a **"Notify me at launch"** action.
5. **Full In-Site Reader View ("alls hondle read"):**
   - Clicking post titles, post excerpts, or "Read" opens the full article reader view `#reader-view`.
   - Formatted bilingual article content with subheadings, quotes, and action items.
   - Direct "Share on WhatsApp" button with custom pre-filled message.
   - Substack email capture box at the bottom of every article.
   - Smooth `← Back to all emails` return navigation.
6. **Full Back-Dated Archive Pagination ("Load more"):**
   - Fetches paginated Substack archive history via `/api/archive` (`offset=0, 10, 20...`), so readers can click **Load more** to browse and read older back-dated issues all the way to your earliest post.
   - Lazy-loads complete article HTML via `/api/post?slug=...` on click.
7. **Persistent Sticky WhatsApp Footer:**
   - Fixed at the bottom of the viewport with official WhatsApp green badge.
   - Direct link to official channel: `https://whatsapp.com/channel/0029VbCMK3rF6smqiLSC493j`.

---

## Project Structure

```
techinhausa-newsletter/
├── index.html          # Complete responsive web application
├── api/
│   ├── _substack.js    # Shared Substack API HTTPS client
│   ├── archive.js      # Vercel Serverless function for paginated historical posts
│   └── post.js         # Vercel Serverless function for full back-dated post content
├── server.js           # Zero-dependency Node.js server with local /api/* support
├── vercel.json         # 1-click Vercel deployment configuration
├── package.json        # Project metadata & npm scripts
├── assets/             # Brand logos (emblem & full wordmark)
└── README.md           # Documentation & deployment guide
```

---

## Deployment Instructions

### Option 1: Vercel (Recommended)
1. Push this folder to a GitHub repository or run `npx vercel` inside this folder.
2. Go to Vercel Project Settings $\rightarrow$ Domains.
3. Add `newsletter.techinhausa.org`.
4. Point your DNS CNAME record to `cname.vercel-dns.com`.

### Option 2: Netlify
1. Drag and drop the `techinhausa-newsletter` folder onto the Netlify dashboard.
2. In Domain Management, add `newsletter.techinhausa.org`.

### Option 3: Local Node.js Server
```bash
npm start
# Server starts at http://localhost:3000
```

---

## Author & Organization
- **Organization:** TechInHausa / Malamiromba Ltd
- **Official Site:** [https://techinhausa.org/](https://techinhausa.org/)
- **WhatsApp Channel:** [https://whatsapp.com/channel/0029VbCMK3rF6smqiLSC493j](https://whatsapp.com/channel/0029VbCMK3rF6smqiLSC493j)
