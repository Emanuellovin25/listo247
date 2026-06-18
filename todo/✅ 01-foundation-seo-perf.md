# 01 — Fundație + SEO infra + Performanță

## Scaffold proiect
- [x] Structură foldere: `/` (HTML-uri), `/assets`, `/fonts`, `/css`, `/js`
- [x] `netlify.toml` cu security headers (X-Frame-Options, CSP de bază, Referrer-Policy, Permissions-Policy) + caché + 404
- [x] Reset CSS + box-sizing global (`css/reset.css`)
- [x] Template `<head>` comun (în `index.html`, reutilizabil) cu toate meta-urile

## SEO infra (per pagină)
- [x] `<title>` + `<meta name="description">` unice, es-ES (index + 404)
- [x] `<link rel="canonical">` + `<link rel="alternate" hreflang="es-ES">` + `x-default`
- [x] Open Graph (type, title, description, url, image) + Twitter Card
- [x] `lang="es"` pe `<html>`
- [x] Un singur `<h1>`/pagină — heading-uri ierarhice & `alt` se aplică pe măsură ce se construiește conținutul

## Schema.org JSON-LD
- [x] Global: `Organization` (nume, logo, contactPoint) + `WebSite` (cu SearchAction)
- [ ] `Service` per serviciu (pe servicios.html) — task 05
- [ ] `FAQPage` (pe FAQ) — task 08
- [ ] `BreadcrumbList` pe paginile interne — pe măsură ce apar paginile

## Fișiere SEO
- [x] `sitemap.xml` (toate paginile publice)
- [x] `robots.txt` (allow + link sitemap)
- [x] `manifest.json` (nume, iconuri, theme-color teal)
- [x] `favicon.svg` — iconuri PNG (16/32/180/192/512) de generat în task 09 (assets)

## Performanță (target Lighthouse mobile 95+, LCP < 2s)
- [x] Critical CSS inline (tokens + above-the-fold); restul CSS deferit (`media="print" onload` + `<noscript>`)
- [x] Fonturi self-hosted + subset `latin`, `font-display:swap`, `preload` — `.woff2` de adăugat în `/fonts/` (vezi README)
- [ ] `preconnect` la domeniul widget-ului de chat — blocat: link widget de la client
- [x] JS deferit (`defer`), zero blocant (`js/main.js`)
- [x] Buget: zero CLS — reset cu dimensiuni img/svg; restul se respectă la build conținut
