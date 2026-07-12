# Karim Nabahi — Portfolio

A static portfolio site (plain HTML/CSS/JS) showcasing GIS and geoinformatics work.

## Featured project
**2,500 Acres in the Adirondacks** — a spatial decision-support system that recommends
which private parcels New York should acquire to satisfy a 2025 constitutional amendment,
ranking parcels (and growing contiguous clusters) under different stakeholder priorities.
The project page includes an interactive Leaflet map that runs entirely client-side.

## Structure
```
index.html              home page
projects/adk-sdss.html  SDSS project page + interactive scenario map
css/style.css           styles
js/data.js              scenario data (inlined GeoJSON, no server needed)
js/sdss-map.js          Leaflet scenario explorer
assets/                 figures
data/                   source GeoJSON
```

## Local preview
Open `index.html` (or `projects/adk-sdss.html`) directly in a browser. Data is inlined,
so no local server is required; an internet connection is only needed for map tiles.

## Deployment
Hosted with GitHub Pages — pushing to `main` redeploys automatically.
