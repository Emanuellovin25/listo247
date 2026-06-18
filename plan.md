# Plan — Website AISR (clínicas dentales y médicas)

> Document master. Toate deciziile sunt aici; pașii de execuție sunt în `todo/`.
> **Nu se construiește nimic încă** — acesta e doar planul + structura de todos + exemplele de conținut de revizuit.

---

## 0. Decizii fixate

| Decizie | Valoare |
|---|---|
| Limbă / piață | **Español de España (es-ES)**, ton informal cu **"tú"** (cald, personal) |
| Direcție vizuală | **Clínico luminoso** — alb/off-white, mult spațiu, 1 accent teal medical |
| Stack | **HTML + CSS + Vanilla JS** (zero framework, zero build greu) → încărcare super rapidă |
| Hosting | Static (Netlify, ca la Lead Excavator) — `netlify.toml` cu security headers |
| Brand afișat | **AISR** (placeholder de lucru — se schimbă cu un singur find-replace dacă numele final diferă) |
| Domeniu (placeholder SEO) | `https://aisr.es` — de înlocuit cu domeniul real în canonical/schema/sitemap |
| Excluse | ❌ testimoniale, ❌ pricing, ❌ limbaj de "AI/features" în copy-ul vizibil |

### Principiul de copy (cel mai important)
Vorbim limba **proprietarului de clinică**, nu limba noastră de tech.
Nu spunem *"chatbot cu NLP și automatizări"*. Spunem:
- *"Que ningún paciente se quede sin respuesta, ni a las 22:00."*
- *"Menos huecos en tu agenda al final del mes."*
- *"Recupera a los pacientes que dejaron de venir."*

Beneficiul întâi, mecanismul (AI) abia după, discret. Fiecare secțiune trebuie să-l facă pe medic să simtă *"esto lo han escrito para mí, son de los míos"*.

---

## 1. Servicii (ce vindem) — exprimate ca rezultate

| Serviciu | Cum îl numim pe site (es-ES) | Rezultatul pentru clinică |
|---|---|---|
| Chat widget | *Chat en tu web* | Răspuns instant pe site, vizitatorul devine programare |
| AI chat (WhatsApp/SMS/Messenger/Instagram) | *Respuestas en todos tus canales* | Mesaje reale 24/7 pe canalul preferat al pacientului |
| Voice AI | *Llamadas atendidas, siempre* | Telefonul nu mai sună în gol; se răspunde și se programează |
| Reactivación de base de datos | *Pacientes que vuelven* | Lista veche de pacienți → programări noi |
| Reseñas de Google | *Más reseñas, sin pedirlas a mano* | Mai multe recenzii 5★ automat, după vizită |

**Capabilități AI chat:** FAQ antrenat pe clinică · încurajare la programare · mesaje realiste · follow-ups · programări automate · remindere.
**Capabilități Voice AI:** la fel, **fără follow-ups**.

---

## 2. Hartă site (pagini)

```
/  index.html ............... Home (cu butonul mare "Probar ahora" → chat widget)
   servicios.html .......... Servicii (secțiuni per serviciu + exemple conversații + voice)
   sobre-nosotros.html ..... About ("uno de los vuestros")
   reservar.html ........... Book a call (Google Calendar + WhatsApp)
   preguntas-frecuentes.html FAQ (cu schema FAQPage)
   privacidad.html ......... Política de privacidad (RGPD/LOPD)
   aviso-legal.html ........ Aviso legal (obligatoriu în Spania, LSSI-CE)
   politica-cookies.html ... Política de cookies
   404.html
```
Fără pagini de testimoniale / pricing.

### Structura Home (storytelling, scroll de sus în jos)
1. **Hero** — propoziția durere→soluție + **buton mare "Probar ahora"** (deschide chat widget) + buton secundar "Reservar llamada". Fundal: *light rays* subtile teal.
2. **El problema** (storytelling) — "Son las 21:40. Un paciente te escribe… y nadie responde." Parallax ușor.
3. **Calculadora "¿Cuánto se te escapa?"** — slidere interactive → vede cât pierde lunar + cât recuperează (14–22%) + bonus reactivare. (DEMO construit: `calculadora.html`) → detalii în §11.
4. **Antes / Después** — toggle interactiv (componenta neo-toggle) "Sin AISR / Con AISR" → arată agenda goală vs plină, no-shows.
5. **Flywheel de canale** — roată animată (WhatsApp, SMS, Messenger, Instagram, Voz) în jurul clinicii; click pe un canal → exemplu de conversație pentru acel canal.
6. **Escucha cómo suena** — player Voice AI 10s (voce realistă es-ES).
7. **Qué hacemos por ti** — 5 carduri rezultat (linkează la servicios.html).
8. **CTA final** — "Pruébalo tú mismo" (widget) + "Hablemos" (reservar).
9. Footer (legal, canale, sello RGPD).

---

## 3. Sistem de design — "Clínico luminoso"

```css
:root{
  --bg:#FFFFFF;
  --bg-soft:#F4F8FB;        /* secțiuni alternante */
  --surface:#FFFFFF;
  --ink:#0F1B2D;            /* text principal (navy aproape negru) */
  --muted:#5B6B7B;          /* text secundar */
  --line:#E6ECF1;           /* borduri fine */
  --primary:#0FB5A6;        /* teal medical (accent unic) */
  --primary-deep:#0B7C73;   /* hover/contrast */
  --primary-soft:#E6F7F5;   /* fundal tint pentru chip-uri/iconuri */
  --ok:#16A34A;             /* "programado", check-uri */
  --radius:18px;
  --shadow:0 10px 40px rgba(15,27,45,.08);
}
```
- **Tipografie:** titluri *Plus Jakarta Sans* (prietenoasă, profesională), text *Inter*. Self-hosted + subset `latin`, `font-display:swap`.
- **Stil:** mult alb, carduri cu shadow soft, borduri 1px `--line`, colțuri rotunjite, iconuri line-style teal. Aerisit, fără aglomerare.
- **Imagini:** fotografii medicale calde (recepție, pacient zâmbind, telefon cu WhatsApp), tratate luminos. AVIF/WebP, `srcset`, `width/height` setate (zero CLS).
- **Mobile-first:** breakpoints 480 / 768 / 1024. Totul citibil și tap-friendly pe telefon.

---

## 4. Animații (din kit-ul tău) → unde le folosim

| Animație (sursa ta) | Unde | Note de performanță |
|---|---|---|
| **Light Rays** (ReactBits) → reimplementat **vanilla WebGL/canvas** | Fundal hero | lazy-init la scroll, oprit pe `prefers-reduced-motion` și pe mobile/low-power; opacitate joasă pe fundal alb |
| **Click Spark** → vanilla canvas overlay | Pe butoanele CTA principale (sparks teal la click) | foarte ușor, doar la interacțiune |
| **Ghost Cursor / Ribbons** | Doar desktop, opțional, în secțiunea Voice (accent) | gated pe hover + reduced-motion |
| **Buton modern** (Uiverse) | Stilul butonului principal (săgeată + cerc), recolorat teal | CSS pur |
| **Neo toggle** (Uiverse) | Toggle "Sin/Con AISR" la secțiunea Antes/Después | CSS pur |
| **Plus button** (Uiverse) | Iconul de expand la FAQ (plus care se rotește) | CSS pur |
| **Cookie card** (Uiverse) | Banner cookies RGPD, recolorat | CSS + puțin JS |
| **animatie header.mov** | Hero sau divider — convertit în `.webm` + poster, `muted loop playsinline`, lazy | comprimat agresiv |
| **Flywheel canale** (creat de noi) | Home — roată SVG cu canalele, click → conversație | SVG + CSS rotation |
| **Scroll/parallax reveals** | Secțiunile de storytelling | IntersectionObserver, transform/opacity only |

**Regula de aur:** toate animațiile respectă `prefers-reduced-motion` și nu blochează LCP. WebGL doar după ce pagina e interactivă.

---

## 5. SEO (perfect) + Performanță (super rapid)

**SEO**
- Title + meta description unice per pagină (es-ES, cu keywords naturale).
- `<link rel="canonical">` + `hreflang="es-ES"` + `x-default`.
- Open Graph + Twitter Card + imagine OG per pagină.
- **Schema.org JSON-LD:** `Organization` + `WebSite` (cu SearchAction) global; `Service` per serviciu; `FAQPage` pe FAQ; `BreadcrumbList` pe pagini interne. (NU `MedicalBusiness` — acela e pentru clinici, noi suntem furnizor B2B.)
- `sitemap.xml`, `robots.txt`, `manifest.json`.
- HTML semantic, **un singur H1/pagină**, heading-uri ierarhice, `alt` descriptiv, linkuri interne.
- Keywords-țintă (naturale, în titluri/meta, nu spam): *reducir ausencias clínica dental*, *atención fuera de horario clínica*, *agenda automática pacientes*, *recuperar pacientes inactivos clínica*, *más reseñas Google clínica dental*.

**Performanță (target: Lighthouse mobile 95+, LCP < 2s)**
- Critical CSS inline; restul CSS deferit.
- Vanilla JS, fără framework; JS deferit/modular.
- Fonturi self-hosted + subset; `preload` la hero + font principal.
- Imagini AVIF/WebP, `loading="lazy"`, `decoding="async"`, dimensiuni explicite.
- `preconnect` la widget chat și (dacă rămân) Google Fonts.
- Animații gated (vezi §4). Zero layout shift.

---

## 6. Book a call
- Pagina `reservar.html` + butoane în nav/hero/footer.
- Două opțiuni clare: **"Reservar en Google Calendar"** (link Calendar/Calendly placeholder) și **"Escríbenos por WhatsApp"** (`https://wa.me/<număr>?text=...` cu mesaj precompletat în es-ES).
- Buton WhatsApp flotant discret pe toate paginile (opțional).

---

## 7. Integrarea chat widget
- Butonul mare **"Probar ahora"** de pe Home deschide widget-ul de chat pe care **îl furnizezi tu** (link la final).
- Implementare: placeholder `data-widget-url` / funcție `openChatWidget()` — se conectează scriptul/iframe-ul tău când îl trimiți. Marcat clar în cod ca `// TODO: widget link`.

---

## 8. Legal (Spania — obligatoriu)
- **Aviso legal** (LSSI-CE), **Política de privacidad** (RGPD/LOPD-GDD), **Política de cookies** + **banner de consimțământ** (componenta cookie). Texte placeholder corecte, de completat cu datele firmei (titular, NIF/CIF, dirección).

---

## 9. Conținut de produs de tine / de generat (vezi §exemple în chat)
- Texte exacte ale conversațiilor per canal (chat widget, WhatsApp, SMS, Messenger, Instagram) — ți le propun, le validezi.
- Clip Voice AI 10s, voce realistă es-ES — script propus, de generat după validare.
- Fotografii / mockup-uri pentru rubricile cu conversații.
- Datele firmei pentru legal + numărul de WhatsApp + linkul de Calendar + linkul widget-ului.

---

## 10. Ordinea de execuție (rezumat todos)
1. `01` Fundație + SEO infra + performanță (scaffold, meta, schema, sitemap, fonturi, netlify)
2. `02` Sistem de design (tokens, tipografie, componente, grid responsive)
3. `03` Animații (light rays, click spark, flywheel, toggle, parallax, gating)
4. `04` Home (hero + buton widget + storytelling + flywheel + voice)
5. `05` Servicios (5 servicii ca rezultate + blocuri de exemple)
6. `06` Sobre nosotros
7. `07` Reservar (Calendar + WhatsApp)
8. `08` FAQ + legal (privacidad, aviso legal, cookies + banner)
9. `09` Conținut & assets (conversații, voice 10s, OG, iconuri)
10. `10` QA & lansare (Lighthouse, a11y, mobile, deploy)
11. `11` Calculadora interactivă (**DEMO deja construit**: `calculadora.html`)

> Detaliile fiecărui pas: `todo/01…11`. Multe taskuri sunt grupate intenționat ca să mergem rapid.

---

## 11. Calculadora «¿Cuánto se te escapa?» — spec final

**Stare:** DEMO standalone funcțional & verificat în browser → `calculadora.html`. Se integrează ca `<section id="calculadora">` în `index.html` (titlul devine `<h2>`).

**Slidere (5):** ① Pacientes/citas a la semana (5–200, def 40) · ② Valor medio de un paciente € (50–3.000, def 350) · ③ Posibles pacientes fuera de horario/semana (0–60, def 10) · ④ De cada 10 citas, no-shows (0–10, def 2) · ⑤ De cada 10 presupuestos, NO cerrados (0–10, def 4).

**Bonus reactivare (colapsabil):** Pacientes en base de datos (def 1.500) × Valor por paciente recuperado (def = valorul de la ②, editabil) → `5% × DB × valor` = „**una sola vez**", „escenario conservador".

**Formula:**
```
w = 4,33 semanas/mes
fuera de horario = C · w · V
no-shows         = A · (N/10) · w · V
presupuestos     = A · 0,35 · (Q/10) · w · V   (0,35 = presupuestos por visita)
G = suma de las tres
HERO (lunar) = 14% – 22% × G     →  ×12 = anual
bonus = 5% × DB × valor_recuperado   (una sola vez, aparte)
```
**Erou:** banda recuperabilă (14–22%), încadrată ca *„lo que se te escapa = lo que AISR recupera"*. 14% = pocos canales · 22% = todo en marcha.
**Onestitate/transparență:** „ⓘ Cómo se calcula" expandabil + disclaimer *„estimación orientativa, no es garantía"*.
**Tehnic:** vanilla JS (~3 KB), count-up la load, `prefers-reduced-motion`, slidere accesibile (taste săgeți + aria), responsive, format **es-ES** (RAE: fără separator la 4 cifre, cu separator de la 5).
**CTA:** „Probar ahora" (→ widget) + „Reservar llamada" (→ reservar).
