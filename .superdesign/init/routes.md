# Routes / Pages

Static multi-page site (no router, no build step). GitHub Pages hosted, deploys on push to `main`.

| Path | File | Description |
|---|---|---|
| `/` | `index.html` | Home page: hero (title + tagline + CTA + photo), Projects (single project card linking to the SDSS project page), About (bio + 2-photo gallery), Contact (email/LinkedIn), footer. |
| `/resume.html` | `resume.html` | Resume page: hero (name + summary + Download PDF/Get in touch CTA), Education, Experience (6 entries), Skills & Certifications, footer. |
| `/projects/adk-sdss.html` | `projects/adk-sdss.html` | Case-study page for the "2,500 Acres in the Adirondacks" SDSS project: hero + meta row, problem statement, interactive Leaflet scenario-explorer map, "how it works" + methodology write-up with a flowchart figure, literature grounding, PDF link, footer. |

## Home page (`index.html`) summary
Sections in order: `.nav` → `.hero` (two-column: text+CTA left, photo right) → `#projects` (card grid, currently 1 card) → `#about` (two-column: bio prose left, stacked photo column right) → `#contact` (simple prose with mailto/LinkedIn links) → `footer`.

## Resume page (`resume.html`) summary
`.nav` → `.proj-hero` (name, lead paragraph, Download PDF + Get in touch buttons) → single `.prose` column containing Education entries, Experience entries (`.resume-entry` blocks with org/location row, role/dates row, bullet list), Skills & Certifications (`.skills-grid` of 3 tag-chip groups) → `footer`.

## Project page (`projects/adk-sdss.html`) summary
`.nav` → `.proj-hero` (title, lead, 4-item meta row) → prose "the problem" → `.explorer` (interactive Leaflet map: scenario buttons, map, info panel, powered by `js/data.js` + `js/sdss-map.js`) → prose "how it works" with flowchart figure → prose "what the results show" → prose "grounding in the literature" + PDF link button → `footer` (with back-link variant).
