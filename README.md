# AISR — sitio web

Sitio estático (HTML + CSS + Vanilla JS, sin build) para captación de clínicas dentales y médicas.
Diseño "clínico luminoso", es-ES, tono cercano ("tú"). Pensado para desplegarse en **Vercel** desde **GitHub**.

## Estructura

```
index.html                 Home (hero, calculadora, antes/después, flywheel de canales, voz, CTA)
servicios.html             5 servicios como resultados
sobre-nosotros.html        About
reservar.html              Reservar llamada (calendario + WhatsApp)
preguntas-frecuentes.html  FAQ (schema FAQPage)
privacidad.html · aviso-legal.html · politica-cookies.html   Legal (RGPD/LOPD/LSSI)
404.html
calculadora.html           Demo standalone (noindex; el contenido real vive en index.html#calculadora)
css/ · js/ · fonts/ · assets/   Estilos, scripts, fuentes auto-alojadas, iconos/OG
vercel.json                Headers de seguridad (CSP) + caché
sitemap.xml · robots.txt · manifest.json
```

## Desplegar en Vercel

1. Sube el repo a GitHub.
2. En Vercel: **Add New → Project → Import** el repo.
3. Framework Preset: **Other**. Build Command: *(vacío)*. Output Directory: *(vacío / raíz)*. No hay paso de build.
4. Deploy. `vercel.json` aplica los headers de seguridad y la caché automáticamente.
5. Añade tu dominio en **Settings → Domains**.

> El `404.html` se sirve solo en rutas no encontradas (comportamiento por defecto de Vercel para sitios estáticos).

## ⚠️ Antes de lanzar — datos que tienes que rellenar tú

Búscalo y reemplázalo (un find-and-replace global resuelve la mayoría):

| Qué | Marcador actual | Dónde |
|---|---|---|
| **Dominio real** | `aisr.es` (84 apariciones) | todos los `.html`, `sitemap.xml`, `robots.txt`, JSON-LD |
| **Número de WhatsApp** | `wa.me/000000000` | `index.html`, `reservar.html`, `sobre-nosotros.html`, `preguntas-frecuentes.html` |
| **Link del widget de chat** | `openChatWidget()` (placeholder con `alert`) | `js/main.js`. Al integrarlo, añade su dominio a `connect-src`/`frame-src` de la CSP en `vercel.json` y un `preconnect` en el `<head>` |
| **Calendario de reservas** | bloque `#calendario` ("Aquí se incrustará…") | `reservar.html` (Calendly/Google Calendar/Cal.com) |
| **Datos de la empresa** | titular, NIF/CIF, dirección | `privacidad.html`, `aviso-legal.html`, `politica-cookies.html` |
| **Clip de voz real** | reproductor simulado (10 s) | `js/main.js` (`vozPlayer`) + `<audio>` en `index.html` sección voz |
| **Fotos reales** | — | recepción/paciente/teléfono en AVIF/WebP, con `width`/`height` |
| **Nombre de marca** | `AISR` | si el nombre final cambia, find-replace de `AISR` |

Tras rellenar: vuelve a comprobar **Lighthouse** y el **Rich Results Test** sobre la URL de producción.

## Notas técnicas

- **CSP estricta**: `script-src 'self'` (sin `unsafe-inline`). Por eso el CSS se carga con `<link rel="stylesheet">` normal (el critical CSS va inline en cada `<head>` para el above-the-fold). No uses `onload="…"` inline en los `<link>`: la CSP lo bloquearía.
- **Caché**: `/assets` y `/fonts` son inmutables (1 año); `/css`, `/js` y `*.html` revalidan, para que tus cambios se vean al instante. Si más adelante versionas los assets con hash, puedes pasar `/css` y `/js` a `immutable`.
- **Accesibilidad/rendimiento**: animaciones gated por `prefers-reduced-motion`, fuentes auto-alojadas con `preload`, imágenes con dimensiones explícitas (cero CLS).
