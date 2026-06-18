# 09 — Conținut & Assets

> Conținutul concret. ✅ = făcut în site. ⏳cliente = depinde de date/validare de la client.

## Conversații per canal — ✅ construite ca bule de chat HTML/SVG în `index.html` (§5 flywheel)
- [x] Chat widget (web) — programare directă *(reprezentat prin „Probar ahora" + secțiunea voz/canale)*
- [x] WhatsApp — follow-up + confirmare cită
- [x] SMS — recordatorio + reprogramare
- [x] Messenger — răspuns FAQ + împingere la programare
- [x] Instagram (DM) — răspuns la o întrebare → programare
- [x] Reactivación BBDD — exprimat în „Pacientes que vuelven" (servicios/antes-después)
- [x] Reseña Google — exprimat în „Más reseñas, sin pedirlas a mano"
> Format: bule de chat în stilul fiecărei platforme, SVG/HTML ușoare (nu screenshot-uri). Done.

## Voice AI
- [x] Script 10s es-ES — **propus** (vezi mai jos). ⏳cliente: validare finală.
- [ ] ⏳cliente/extern: generare clip audio (`.mp3`/`.ogg`) cu voce realistă es-ES + adăugare `<audio>` real în `voz__card`
- [x] Player accesibil (controale, `prefers-reduced-motion` la waveform) — construit în `index.html` + `js/main.js`

### Script Voice AI propus (≈10s, es-ES, ton cald)
> «Clínica Dental, buenas tardes. Tengo hueco el jueves a las cinco y media
> o el viernes a las diez. ¿Cuál te viene mejor?… Perfecto, te lo reservo.»

## Vizuale
- [x] Iconuri canale animate (flywheel) — SVG inline în `index.html`
- [ ] ⏳cliente: fotografii medicale luminoase (recepție, pacient, telefon) — AVIF/WebP optimizate
- [x] Imagini OG per pagină (1200×630) — generate în `assets/og/` (home, servicios, nosotros, reservar, faq)
- [x] Logo AISR — `assets/favicon.svg` + iconuri PWA `assets/icons/icon-{180,192,512}.png`

## Copy
- [x] Toate textele paginilor în es-ES, ton „tú" — scrise
- [ ] ⏳cliente: revizuire finală de un vorbitor nativ + completarea datelor legale reale
