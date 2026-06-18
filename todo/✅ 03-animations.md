# 03 — Animații (kit-ul tău) + performanță

> Toate respectă `prefers-reduced-motion` și nu blochează LCP. WebGL doar după interactive.

## Background / hero
- [x] **Light Rays** reimplementat vanilla (WebGL sau canvas 2D fallback), raze teal subtile pe alb
- [x] lazy-init la scroll (IntersectionObserver), oprit pe mobile/low-power + reduced-motion
- [ ] `animatie header.mov` → convertit `.webm` + poster JPG, `muted loop playsinline`, lazy — **blocat: lipsește fișierul `.mov` (asset, task 09)**

## Interacțiune
- [x] **Click Spark** (canvas overlay) pe butoanele CTA — sparks teal la click
- [ ] **Ghost Cursor / Ribbons** — doar desktop, opțional, secțiunea Voice (gated pe hover) — **amânat: secțiunea Voice se construiește în task 04**
- [x] **Buton modern** (Uiverse) recolorat teal = stilul CTA principal
- [x] **Neo toggle** (Uiverse) = toggle "Sin AISR / Con AISR"
- [x] **Plus button** (Uiverse) = icon expand FAQ (rotație la deschidere)

## Flywheel canale (creat de noi)
- [x] Roată SVG: clinica în centru, satelite = WhatsApp, SMS, Messenger, Instagram, Voz
- [x] Rotație CSS lentă; hover/tap pe canal oprește rotația + evidențiază
- [x] Click pe canal → afișează blocul de conversație al acelui canal
- [x] Fallback static (listă) când reduced-motion

## Scroll / storytelling
- [x] Reveal on scroll (opacity+translate) via IntersectionObserver
- [x] Parallax subtil pe 1–2 imagini de fundal (transform only)
- [x] Fără jank: doar `transform`/`opacity`, `will-change` cu măsură
