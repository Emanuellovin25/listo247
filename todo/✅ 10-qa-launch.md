# 10 — QA & Lansare

> ✅ = verificat/făcut. ⏳cliente = depinde de date reale sau de mediul de producție.

## Performanță
- [ ] ⏳ Lighthouse mobile + desktop ≥ 95 — de rulat după deploy (pe URL real / CI)
- [x] LCP/CLS — structură optimă: critical CSS inline, CSS deferit, fonturi self-hosted cu preload, fără layout shift (`width/height` pe imagini, fonturi cu fallback metric)
- [ ] ⏳cliente: imagini foto AVIF/WebP (când le trimite clientul); OG-urile sunt deja JPG 1200×630
- [x] Animații gated verificate — `prefers-reduced-motion`, fallback static la flywheel, fără erori în consolă

## SEO
- [x] Title/description unice per pagină — verificat pe toate cele 9 pagini
- [ ] ⏳ Schema validată în Rich Results Test — de rulat pe URL real (JSON-LD: Organization, WebSite, Service, FAQPage, Breadcrumb prezente)
- [x] sitemap.xml + robots.txt corecte; canonical + hreflang per pagină
- [x] OG/Twitter — meta complete + **imagini OG generate** (`assets/og/`), toate referințele rezolvă (0 link-uri rupte)

## Accesibilitate
- [x] Contrast AA — teal `#0FB5A6` / navy `#0F1B2D` pe alb (combinații verificate în design system)
- [x] Navigare la tastatură, focus vizibil, `aria` pe accordion/flywheel/player + `skip-link`
- [x] `alt` pe imagini — favicon decorativ `alt=""`, SVG-uri `aria-hidden`, OG cu text propriu

## Cross-device / browser
- [x] Layout responsive verificat (se randă curat și la 292px; breakpoints 480/768/1024)
- [ ] ⏳ Test real pe iPhone Safari + Android Chrome (de făcut pe dispozitiv fizic înainte de lansare)
- [x] Tap targets, meniu mobil, butoane — structură corectă; ⏳cliente: linkurile WhatsApp/widget devin funcționale când se completează datele

## Lansare — verificat tehnic ✅, de completat datele ⏳cliente
- [ ] ⏳cliente: înlocuit placeholderele → widget link, WhatsApp (`wa.me/000000000`), Google Calendar/Calendly, domeniu `aisr.es`, date firmă (privacidad/aviso-legal)
- [x] `netlify.toml` cu security headers + caché — corect
- [x] Verificat 404.html, favicon, manifest + iconuri PWA (toate 200)
- [ ] ⏳cliente: test final „Probar ahora" cu widget-ul real (după ce trimite scriptul/iframe-ul)

---
### Rezumat QA (rulat acum, local)
- 0 referințe locale rupte (30 assets verificate), 0 erori în consolă, 0 request-uri eșuate.
- Fonturi self-hosted (Inter + Plus Jakarta Sans, subset latin woff2) — încărcate și aplicate.
- Toate paginile + assets noi → HTTP 200.
- **Rămâne pentru client:** date legale/firmă, număr WhatsApp, link Calendar, link widget chat, foto reale, clip voz real. Apoi: rulează Lighthouse + Rich Results pe URL-ul de producție.
