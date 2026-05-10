# AURUM Restaurant — Landing Page Demo

> **Demo project** · Portfolio piece showcasing a luxury fine-dining restaurant website  
> Stack: HTML5 · CSS3 · JavaScript (ES6 Modules) · No frameworks

---

## 📁 Project Structure

```
aurum-restaurant/
├── index.html              ← Main entry point (full landing page)
│
├── css/
│   ├── reset.css           ← CSS normalisation
│   ├── variables.css       ← Design tokens (colours, typography, spacing…)
│   ├── main.css            ← Global styles, utilities, animations
│   ├── components.css      ← Section-specific component styles
│   └── responsive.css      ← Breakpoint media queries
│
├── js/
│   ├── main.js             ← Entry point — orchestrates all modules
│   ├── animations.js       ← Scroll reveal, parallax, counter animation
│   └── form.js             ← Reservation form validation & submission
│
├── assets/
│   └── images/             ← All AI-generated images (PNG)
│       ├── hero-bg.png
│       ├── chef.png
│       ├── dish-1.png
│       ├── dish-2.png
│       ├── dish-3.png
│       ├── gallery-1.png
│       ├── gallery-2.png
│       └── og-image.png
│
├── robots.txt              ← Crawler configuration
├── sitemap.xml             ← XML sitemap for search engines
└── README.md               ← This file
```

---

## 🚀 Getting Started

### Option A — Local server (recommended)

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# VS Code: install Live Server extension, right-click index.html → Open with Live Server
```

Then open `http://localhost:8000` in your browser.

> **Important:** The project uses ES6 modules (`type="module"`), which require a server.  
> Opening `index.html` directly with `file://` will not work correctly in most browsers.

### Option B — Deploy

Drop the entire folder into any static hosting provider:
- **Netlify** — drag & drop the folder into app.netlify.com
- **Vercel** — `vercel .` from the project root
- **GitHub Pages** — push to a repo and enable Pages in Settings

---

## ✨ Features

| Feature | Details |
|---|---|
| **Responsive** | Mobile-first, tested at 320px, 768px, 1024px, 1440px |
| **Scroll animations** | Intersection Observer — zero-dependency, performant |
| **Hero parallax** | Smooth parallax scroll with CSS-only zoom transition |
| **Menu tabs** | Accessible tabpanel with ARIA roles |
| **Testimonials slider** | Touch/swipe support, autoplay, keyboard-accessible |
| **Reservation form** | Real-time validation, simulated async submission |
| **SEO** | Meta tags, Open Graph, Twitter Card, JSON-LD schema, sitemap, robots.txt |
| **Accessibility** | Semantic HTML5, ARIA labels, skip-to-content, reduced-motion |
| **Performance** | Critical image preload, lazy loading, passive scroll listeners |
| **Dark luxury design** | Cormorant Garamond + Jost, gold palette, grain overlays |

---

## 🎨 Design System

### Colours
| Token | Value | Use |
|---|---|---|
| `--color-carbon` | `#0D0D0D` | Page background |
| `--color-charcoal` | `#141414` | Section alternation |
| `--color-gold` | `#C9A84C` | Brand accent |
| `--color-cream` | `#F5F0E8` | Primary text |

### Typography
| Role | Font | Weight |
|---|---|---|
| Display / Headings | Cormorant Garamond | 300, 400, 600 |
| Small Caps / Logo | Cormorant SC | 300, 400 |
| Body / UI | Jost | 300, 400, 500 |

---

## 🔧 Customisation

1. **Restaurant name / content** → Edit `index.html`
2. **Colours / fonts** → Edit `css/variables.css`
3. **Section styles** → Edit `css/components.css`
4. **Form backend** → Replace `submitReservation()` in `js/form.js` with a real `fetch()` call
5. **SEO** → Update meta tags, JSON-LD data and sitemap URLs in `index.html` / `sitemap.xml`

---

## 📄 Notes

- Images are AI-generated for demo purposes. Replace with licensed photography for production.
- The form submission is simulated (no actual backend). Connect to any form service (Formspree, EmailJS, custom API) by editing `js/form.js`.
- Font loading uses Google Fonts CDN. For production, consider self-hosting fonts for privacy & performance.

---

*Built as a portfolio demo project. All brand names, addresses and contact details are fictional.*
