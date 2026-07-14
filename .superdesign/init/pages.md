# Page Dependency Trees

No JS framework/imports — dependencies are just linked CSS/JS/asset files referenced from each HTML file.

## / (Home Page)
Entry: `index.html`
Dependencies:
- `css/style.css` (global stylesheet — full file, only stylesheet in the project)
- `assets/field-scc-2.jpg` (hero photo)
- `assets/sdss-thumb.png` (project card thumbnail)
- `assets/field-vycc-1.jpg`, `assets/field-scc-3.jpg` (About section photo column)
- inline `<script>` (2 lines, sets footer copyright year via `document.getElementById('yr')`)

No shared layout files are separate components — nav/footer markup is duplicated inline in this file (see `layouts.md`).

## /resume.html (Resume Page)
Entry: `resume.html`
Dependencies:
- `css/style.css`
- `assets/Resume_Karim.pdf` (Download PDF button target)
- inline year script (same pattern as home)

## /projects/adk-sdss.html (SDSS Project Page)
Entry: `projects/adk-sdss.html`
Dependencies:
- `../css/style.css`
- `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css` (external CDN)
- `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js` (external CDN)
- `../js/data.js` — inlines `window.SCENARIOS` (GeoJSON, 33 features) and `window.ADK_BOUNDARY` (GeoJSON) as plain JS globals; no build step, loaded as a plain `<script src>`.
- `../js/sdss-map.js` — the entire scenario-explorer behavior (builds the Leaflet map, scenario toggle buttons, info panel HTML strings, popups). Depends on `data.js` globals being loaded first.
- `../assets/flowchart.png` (static figure in the "How it works" section)
- `../assets/Karim_Nabahi_Adirondack_SDSS.pdf` (linked at the bottom, "Read the full paper")

**Note for design work targeting the home page**: only `index.html` + `css/style.css` (full file) + the 3 photo assets above are needed as context — this is a fully self-contained page with no shared component files to trace.
