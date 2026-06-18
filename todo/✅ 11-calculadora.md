# 11 — Calculadora "¿Cuánto se te escapa?"

> **DEMO construit & verificat în browser:** [`../calculadora.html`](../calculadora.html)
> Spec complet: [`../plan.md`](../plan.md) §11. Aici = ce rămâne pentru integrarea în site.

## Stare
- [x] Spec validată cu clientul (banda recuperabilă · 5 slidere + asumpția 0,35 · bonus 5% reactivare)
- [x] Demo standalone funcțional (`calculadora.html`) — testat: defaults → 5010–7870 €/mes, bonus 26.250 €
- [x] Integrare ca `<section id="calculadora">` în `index.html` (h1 → h2/h3)
- [x] Mutat CSS-ul inline → `css/calculadora.css` (tokens partajați, acotat sub `#calculadora`)
- [x] Fonturi self-hosted (`/css/fonts.css` + `.woff2`), zero Google Fonts în index.html
- [x] Wire CTA: „Probar ahora" → `data-open-chat`/`openChatWidget()` · „Reservar llamada" → `reservar.html`
- [ ] (Opțional) intrare în nav „Calculadora" + ancoră — *omis intenționat; servicios.html deja linkează `/#calculadora`*

## Mejoras "más en su idioma" — implementate ✅
- [x] Maxime mărite: pacientes/semana **500** · ticket medio **10.000 €** · base de datos **50.000** · valor recuperado **10.000 €**
- [x] Grupare „**Tu clínica** (lo que ya sabes)" vs „**Lo que se te escapa** (lo que casi nadie mide)"
- [x] Traducere în **pacienți**: „≈ X–Y pacientes al mes que hoy se quedan por el camino" (cifra pe care o simt cu adevărat)
- [x] **Preset pe tip de consultă** (Dental/Médica/Estética/Fisio) → setează ticket-ul medio
- [x] „**tu mayor fuga**" — evidențiază automat cea mai mare pierdere din breakdown
- [x] Copy mai cald, pe limbajul lor (*ticket medio, sillón parado, presupuestos en un cajón, no-shows*)

## Mejoras aprobate — implementate ✅ (cele 5)
- [x] `localStorage` (`aisr-calc-v1`) — își amintește slidere + preset + starea bonus la revenire
- [x] `aria-valuetext` pe slidere (screen reader citește „350 euros", „2 de cada 10 citas", nu doar cifra)
- [x] Preset-urile setează și **no-show + aceptación tipice pe sector** (Dental 2/4 · Médica 1/2 · Estética 2/5 · Fisio 3/3); mutarea manuală a unui slider deselectează preset-ul
- [x] Soft lead-capture: „¿Te mando este desglose por WhatsApp?" → `wa.me` prerellenat cu desglose-ul actual *(număr placeholder `000000000` + TODO client)*
- [x] „Comparativa **sin / con AISR**" cu neo-toggle în panoul de rezultat → schimbă encuadre-ul (héroe teal→verde `--ok`) + link „Velo en tu agenda" care duce la `#antes` și pune acea secțiune pe „Con AISR"

## QA specific
- [x] Mobil (375px): slidere full-width, o singură coloană, fără overflow orizontal din calculator (overflow-ul rămas vine din `.problema__glow`/`.flywheel`/`.fx-spark`, decorative, în afara taskului)
- [x] Taste săgeți pe slidere + focus vizibil (`:focus-visible`)
- [x] `prefers-reduced-motion` → fără count-up și scroll instant (verificat)
- [x] Format es-ES corect (héroe `5010` fără separator la 4 cifre · anual `60.100` cu separator la 5+)
- [x] Disclaimer „estimación orientativa" prezent
- [x] Salvează ultima stare a sliderelor în `localStorage`

> **Verificat în browser** (DOM + console fără erori): aria-valuetext pe toate sliderele, `localStorage` scris/citit, mesaj WhatsApp prerellenat, preset Estética → 350/2/5, toggle sin/con (héroe teal↔verde, link la `#antes`).
> ⚠️ Server static de dev: CSS/JS se cache-uiesc fără hash în URL → după modificări, hard-reload (cache-bust) ca să vezi noua versiune. În producție (Netlify) folosește headerele din `netlify.toml`.
