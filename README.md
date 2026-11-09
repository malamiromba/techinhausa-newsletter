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
   - Client-side and server-side automated ingestion from Substack RSS (`https://newsletter.techinhausa.org/feed`).
   - Automatic classification of incoming posts into the 5 core categories (`Non-technical`, `AI update`, `Practical guide`, `Stories`, `Ads`).
   - Seamless fallback to curated bilingual articles if offline or sandboxed.
2. **Editorial Hero & Key Metrics:**
   - Official centered TechInHausa emblem logo.
   - Exact audience metrics strip:
     - **500K+ Audience**
     - **70K+ Community**
     - **100% Free**
     - **1K App Downloads**
   - Substack email subscription form.
3. **TechInHausa Impact Banner:**
   - Soft blue framing lines (`#B9CBE2`) above and below.
   - Yellow button: `TechInHausa Impact ↗` linking to `https://techinhausa.org/`.
   - Editorial serif text: `Learn about our work in the community.` with interactive golden hover effect.
4. **Hausa Dictionary Feature:**
   - Header button: `Hausa Dictionary` with `Soon` badge.
   - Opens an interactive modal describing the upcoming bilingual Hausa tech dictionary.
5. **Full In-Site Reader View ("alls hondle read"):**
   - Clicking post titles, post excerpts, or "Read full email →" opens the full article reader view `#reader-view`.
   - Formatted bilingual article content with subheadings, quotes, and action items.
   - Direct "Share on WhatsApp" button with custom pre-filled message.
   - Substack email capture box at the bottom of every article.
   - Smooth `← Back to all emails` return navigation.
6. **Persistent Sticky WhatsApp Footer:**
   - Fixed at the bottom of the viewport with official WhatsApp green badge.
   - Direct link to official channel: `https://whatsapp.com/channel/0029VbCMK3rF6smqiLSC493j`.

---

## Project Structure

```
techinhausa-newsletter/
├── index.html          # Complete responsive web application
├── server.js           # Zero-dependency Node.js server with Substack RSS proxy
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
