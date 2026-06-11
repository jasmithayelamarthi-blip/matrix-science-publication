# Matrix Science Publication

A student-run, peer-reviewed **international high-school science journal**. Clean, editorial, Nature-inspired design — built with **pure HTML, CSS and JavaScript** (no framework, no build step) and ready to deploy on **Netlify** with a built-in CMS for editors.

🔬 Subjects: **Physics · Biology · Chemistry · Astrophysics · Biotechnology**

---

## ✨ Features

- **3D WebGL geode hero (Three.js)** — a photorealistic rocky geode with a bumpy normal-mapped exterior that **cracks open in 3D** on click, revealing glossy, light-reflecting crystal clusters coloured per subject and lit by an inner glow. Subtle auto-orbit; click a cluster to open its subject page. Falls back to a static subject menu if WebGL is unavailable.
- **Premium hero background** — deep `#0a0e1a → #060810` gradient with film-grain noise and a radial light bloom behind the geode.
- **Nature-style article listings** — subject tag, type, date, bold title, summary and auto-generated thumbnail, with Article Type / Subject / Year filters.
- **Subject pages** — themed per subject with 5-stop gradients, listing that field's articles (`subject.html?s=physics`).
- **Videos hub** — Nature-style video section with subject filter tags and placeholder video cards.
- **Science Wordle** — a fully working 6-guess game with 50 five-letter science words and a fun fact on every win or loss. Gray (absent) letters **fade out and disappear** from the keyboard so only letters still in play remain.
- **Science Crossword** — a NYT-style 11×11 crossword (validated, fully interlocking) with science clues across physics, chemistry, biology and general science; click/keyboard navigation, Check / Reveal / Clear, a timer, and a fun fact on solving.
- **About, Team & Contact pages** — mission, five-step editorial process, values, history, vision; founder + placeholder team slots; validated contact form (wired for Netlify Forms).
- **Netlify CMS (`/admin`)** — editors publish new articles without touching code.
- **Fully mobile responsive** with an accessible nav (keyboard + ARIA).

## 📁 Structure

```
.
├── index.html            # Homepage (geode hero + latest articles)
├── articles.html         # All research articles + filters
├── subject.html          # Per-subject page (?s=physics|biology|…)
├── videos.html           # Videos hub (subject filter tags + cards)
├── wordle.html           # Science Wordle game
├── crossword.html        # Science Crossword (NYT-style)
├── about.html            # Mission, editorial process, values, history, vision
├── team.html             # Journal staff (founder + placeholders)
├── contact.html          # Contact form (Netlify Forms ready)
├── css/main.css          # Design system
├── css/crossword.css     # Crossword-specific styles
├── js/
│   ├── data.js           # Subjects (gradients) + articles + videos + SVG thumbnails
│   ├── components.js     # Shared header/nav/footer
│   ├── render.js         # Article-row rendering helpers
│   ├── geode3d.js        # 3D WebGL geode (Three.js, loaded via CDN import map)
│   ├── home.js / articles.js / subject.js / videos.js / wordle.js / crossword.js / contact.js
├── admin/                # Netlify (Decap) CMS — config.yml + dashboard
├── content/articles.json # Articles published via the CMS (read by the site)
├── assets/               # Favicon + CMS image uploads
└── netlify.toml          # Netlify config (publish, redirects, headers)
```

## 🚀 Run locally

It's static — any web server works. From the project root:

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

(Opening files directly via `file://` mostly works, but a local server is recommended so `content/articles.json` can be fetched.)

## ☁️ Deploy to Netlify

1. Push this repo to GitHub (done — see below).
2. In Netlify: **Add new site → Import from Git** and pick this repo. No build command; publish directory is the repo root (already set in `netlify.toml`).
3. Enable the CMS:
   - **Site settings → Identity → Enable Identity**.
   - Under **Identity → Services → Git Gateway**, click **Enable**.
   - **Identity → Invite users** to add your editors.
4. Editors go to `https://<your-site>/admin/`, log in, and publish articles — saved straight into `content/articles.json`, which the site reads live.

The contact form is captured automatically by **Netlify Forms** (`data-netlify="true"`).

## 🧪 Adding articles without Netlify

Edit `content/articles.json` directly:

```json
{ "articles": [
  { "id": "2026-bio-1", "subject": "biology", "type": "Research Article",
    "date": "2026-06-01", "title": "…", "summary": "…", "author": "…" }
]}
```

New entries appear at the top of every listing automatically.

---

© 2026 Matrix Science Publication · Founded by **Jasmitha**, Editor-in-Chief.
