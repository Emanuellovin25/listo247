# 02 — Sistem de design "Clínico luminoso"

## Tokens (CSS variables) — vezi plan.md §3
- [x] Culori: `--bg #FFFFFF`, `--bg-soft #F4F8FB`, `--ink #0F1B2D`, `--muted #5B6B7B`, `--line #E6ECF1`, `--primary #0FB5A6`, `--primary-deep #0B7C73`, `--primary-soft #E6F7F5`, `--ok #16A34A`
- [x] Radius `--radius:18px`, shadow soft `--shadow`
- [x] Scală spațiere (4/8/12/16/24/32/48/64/96)
- [x] Scală tipografică fluidă (`clamp()`) pt. h1–h6 + body

## Tipografie
- [x] Titluri: Plus Jakarta Sans (self-hosted, subset)
- [x] Body: Inter (self-hosted, subset)
- [x] `line-height` confortabil, max-width text ~70ch

## Componente reutilizabile
- [x] **Nav** (logo + linkuri + CTA), sticky, transparent→solid la scroll
- [x] **Buton primar** (stil "Buton modern": săgeată slide + cerc, teal) + buton secundar (outline) + buton WhatsApp
- [x] **Card** (rezultat / serviciu) cu icon line teal
- [x] **Chip / badge** (canale, "24/7", "RGPD")
- [x] **Section wrapper** (alternanță `--bg` / `--bg-soft`, padding generos)
- [x] **Footer** (legal, canale, sello RGPD)
- [x] **Bloc conversație** (bula de chat stil mesagerie, per canal)

## Responsive / mobile-first
- [x] Breakpoints 480 / 768 / 1024
- [x] Nav → meniu hamburger pe mobil
- [x] Grid-uri colapsează la 1 coloană; tap targets ≥ 44px
- [x] Verificat totul la 360–390px lățime
