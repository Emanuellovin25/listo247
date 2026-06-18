# /fonts — fuentes auto-alojadas

Coloca aquí los `.woff2` (subset `latin`) que referencia `css/fonts.css`:

- `plus-jakarta-sans-latin.woff2` — títulos (pesos 600–800)
- `inter-latin.woff2` — texto (pesos 400–600)

## Cómo generarlos
1. Descarga las fuentes (Google Fonts / GitHub oficial).
2. Subsetea a `latin` y convierte a woff2, p. ej. con [glyphhanger](https://github.com/zachleat/glyphhanger):
   ```
   glyphhanger --subset="*.ttf" --formats=woff2 --LATIN
   ```
3. Coloca los `.woff2` aquí con los nombres exactos de arriba.

`<head>` ya hace `preload` del woff2 principal de cada familia, así que solo hay que
soltar los archivos. Mientras no estén, el sitio usa `system-ui` como fallback.
