# 04 — Home (index.html)

> Storytelling de sus în jos. Copy es-ES, "tú", beneficiu întâi. Vezi plan.md §2.

## Secțiuni
- [x] **Hero**
  - H1 durere→soluție (ex: *"Ningún paciente sin respuesta. Ni a las diez de la noche."*)
  - Subtitlu scurt (1 frază, rezultat)
  - **Buton mare "Probar ahora"** → `openChatWidget()` (placeholder link widget)
  - Buton secundar "Reservar una llamada" → reservar.html
  - Fundal: light rays subtile + (opțional) header video
- [x] **El problema** (storytelling) — scenă "21:40, un paciente escribe y nadie responde" + parallax
- [x] **Calculadora «¿Cuánto se te escapa?»** — slidere → pierdere lunară + recuperare 14–22% + bonus reactivare *(DEMO gata: [`../calculadora.html`](../calculadora.html); vezi [`11-calculadora.md`](11-calculadora.md))*
- [x] **Antes / Después** — neo-toggle "Sin AISR / Con AISR": agenda goală + no-shows ↔ agenda plină
- [x] **Flywheel de canales** — roata animată; click pe canal → conversație (din §09)
- [x] **Escucha cómo suena** — player Voice AI 10s (es-ES), buton play mare, waveform
- [x] **Qué hacemos por ti** — 5 carduri rezultat → linkează la servicios.html
- [x] **CTA final** — "Pruébalo tú mismo" (widget) + "Hablemos" (reservar)
- [x] **Footer**

## Integrare widget
- [x] `openChatWidget()` + `data-widget-url` placeholder, marcat `// TODO: widget link`
- [x] `preconnect` la domeniul widget-ului

## Verificări
- [x] H1 unic, schema Organization+WebSite, OG image proprie
- [x] Mobil: butonul "Probar ahora" vizibil fără scroll (above the fold)
