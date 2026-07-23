# NYC VRU Crash Analysis Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second project page (`projects/nyc-vru-crash.html`) to the portfolio, showcasing the NYC vulnerable-road-user crash analysis, matching the existing `projects/adk-sdss.html` page's template and interactivity level (live client-side Leaflet map).

**Architecture:** Three small pre-aggregated GeoJSON exports (generated once from the source Jupyter notebook's already-validated dataframes) get inlined into a new `js/nyc-crash-data.js`, following the exact pattern `js/data.js` already uses for the Adirondack page. A new `js/nyc-crash-map.js` drives a 3-layer Leaflet toggle (Bike Lane Gaps / 311 Overlap Zones / High-Risk ZIP Codes), reusing the site's existing `.explorer`/`.toolbar`/`.scenario-btns`/`.map-wrap`/`.info-panel` CSS from `css/style.css` unmodified. The new page reuses the jank-container/top-bar/sidebar chrome and `.meta-stat`/`.frame-*`/`.icon-badge` classes already in `css/jank.css`.

**Tech Stack:** Static HTML + Tailwind CDN + custom CSS (existing site stack, unchanged), Leaflet 1.9.4 (already used on the ADK page), Python/GeoPandas (source notebook, `sds` conda env) for the one-time data export.

## Global Constraints

- Source notebook: `C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\Karim_MV_Collision_FinalProj.ipynb` (109 cells, last executed clean end-to-end, 0 error cells, execution counts monotonic 1-45).
- Neither `js/data.js` nor `js/sdss-map.js` is modified — purely additive, the ADK page must keep working unchanged.
- Do not redesign or modify `projects/adk-sdss.html`, or change the site's global nav/CSS theme beyond adding one new project card to `index.html`.
- Do not publish `MV_Collision_Portfolio`'s raw data files (multi-hundred-MB CSVs, already gitignored) — only the small pre-aggregated GeoJSON exports go in the portfolio's `data/`.
- **Correction to the design spec:** `docs/superpowers/specs/2026-07-16-nyc-vru-crash-page-design.md` states the Section 4.11 confounding check as "Spearman ρ=0.298 ... ~16% street-name match rate." The notebook's actual current cell output (cell 88, verified directly while writing this plan) is **ρ=0.32, p<0.0001, 406/2,388 matched (17.0%)**. This plan uses the notebook's live numbers, not the spec's. Everything else in the spec is confirmed accurate against the notebook as of this plan's writing.
- **Scope note (not in the original spec):** the site gained an EN/FR toggle and French page translations (`index-fr.html`, `resume-fr.html`, `projects/adk-sdss-fr.html`) after this spec was written. This plan does **not** add a French version of the new page or a lang-toggle to it, since that's outside the approved spec's stated scope. Flag to the user as a known follow-up, not a gap in this plan.

---

## Task 1: Push MV_Collision_Portfolio to a new public GitHub repo

**Files:** none (external repo action only)

**Interfaces:**
- Produces: a public GitHub repo URL, referenced by Task 5's Methodology section link (`https://github.com/knabahi/<REPO_NAME>`)

This is a one-way, publicly-visible action. The spec explicitly requires confirming the exact repo name and visibility with the user immediately before doing it — do not skip the confirmation step even though "push it publicly" is already decided in principle.

- [ ] **Step 1: Confirm repo name and visibility with the user**

Ask the user (do not proceed without an answer): "I'm about to push `MV_Collision_Portfolio` to a new **public** GitHub repo under your `knabahi` account, so the new page's Methodology section has somewhere real to link. Suggested name: `mv-collision-nyc-vru-analysis`. Use that name, or a different one?"

- [ ] **Step 2: Verify the local repo is clean**

```bash
cd "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio"
git status
```

Expected: `nothing to commit, working tree clean` (confirmed clean as of this plan's writing — re-check in case of drift).

- [ ] **Step 3: Create and push the repo**

Substitute `<REPO_NAME>` with the name confirmed in Step 1.

```bash
cd "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio"
gh repo create knabahi/<REPO_NAME> --public --source=. --remote=origin --push
```

- [ ] **Step 4: Verify**

```bash
gh repo view knabahi/<REPO_NAME>
git remote -v
```

Expected: repo view succeeds and shows `Visibility: public`; `git remote -v` shows `origin  https://github.com/knabahi/<REPO_NAME>.git`.

Record the URL `https://github.com/knabahi/<REPO_NAME>` — Task 5 needs it verbatim.

---

## Task 2: Export the 3 GeoJSON files from the notebook

**Files:**
- Modify: `C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\Karim_MV_Collision_FinalProj.ipynb` (append 2 cells: 1 markdown, 1 code)
- Modify: `C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\CHANGELOG.md` (append entry, matching its existing per-change style)
- Produces (written by the notebook into its own working directory): `export_nyc-crash-bike-gaps.geojson`, `export_nyc-crash-311-overlap.geojson`, `export_nyc-crash-zip-risk.geojson`

**Interfaces:**
- Consumes (notebook in-kernel variables, already validated by prior cells): `accidents_with_dist` (GeoDataFrame, has `LATITUDE`, `LONGITUDE`, `ON STREET NAME`, `distance_to_lane_meters`), `top10_100` (set of 10 street name strings, cell 60), `final_map_df` (DataFrame, has `LATITUDE`, `LONGITUDE`, `ON STREET NAME`, `Data Type`, cell 94), `nyc_zip` (GeoDataFrame, has `postalcode`, `geometry`, cell 98), `density_df` (DataFrame, has `zipcode`, `ACCIDENT_COUNT`, `population_clean`, `Risk Category`, cell 100), `core` (set of 5 robust zip strings, cell 101)
- Produces: 3 GeoJSON FeatureCollections with these exact property schemas (consumed by Task 3):
  - Bike gaps: `{street: string, dist_m: number}` per Point feature
  - 311 overlap: `{street: string, kind: "Bike Accident"|"Blocked Lane 311 Complaint"|"Overlap (Accident + Complaint)"}` per Point feature
  - ZIP risk: `{zipcode: string, risk_category: "robust-high"|"borderline"|"normal", accident_count: number|null, population: number|null}` per Polygon feature

- [ ] **Step 1: Append the export cells to the notebook**

```bash
python3 -c "
import json

nb_path = r'C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\Karim_MV_Collision_FinalProj.ipynb'
nb = json.load(open(nb_path, encoding='utf-8'))

md_source = '## 8. Portfolio Data Export\nExports 3 small, pre-aggregated GeoJSON files for the portfolio site\\'s interactive map -- the 10 off-network bike-gap streets, the 311/accident overlap points, and ZIP-code risk polygons. Written to this notebook\\'s working directory; copied into the portfolio repo\\'s data/ folder separately.\n'
md_cell = {
    'cell_type': 'markdown',
    'metadata': {},
    'source': md_source.splitlines(keepends=True)
}

code_source = '''import geopandas as gpd

# --- Export 1: Bike Lane Gaps (top-10 off-network streets) ---
bike_gaps_export = accidents_with_dist[
    (accidents_with_dist['\''distance_to_lane_meters'\''] > 100) &
    (accidents_with_dist['\''ON STREET NAME'\''].isin(top10_100))
][['\''LATITUDE'\'', '\''LONGITUDE'\'', '\''ON STREET NAME'\'', '\''distance_to_lane_meters'\'']].dropna(subset=['\''LATITUDE'\'', '\''LONGITUDE'\'']).copy()

bike_gaps_gdf = gpd.GeoDataFrame(
    bike_gaps_export,
    geometry=gpd.points_from_xy(bike_gaps_export.LONGITUDE, bike_gaps_export.LATITUDE),
    crs=\"EPSG:4326\"
)
bike_gaps_gdf = bike_gaps_gdf.rename(columns={'\''ON STREET NAME'\'': '\''street'\'', '\''distance_to_lane_meters'\'': '\''dist_m'\''})
bike_gaps_gdf[['\''street'\'', '\''dist_m'\'', '\''geometry'\'']].to_file(\"export_nyc-crash-bike-gaps.geojson\", driver=\"GeoJSON\")
print(f\"Exported {len(bike_gaps_gdf)} bike-gap accident points across {bike_gaps_gdf['\''street'\''].nunique()} streets\")

# --- Export 2: 311 Overlap (accidents + complaints + overlap zones, top-15 streets) ---
overlap_export = final_map_df[['\''LATITUDE'\'', '\''LONGITUDE'\'', '\''ON STREET NAME'\'', '\''Data Type'\'']].dropna(subset=['\''LATITUDE'\'', '\''LONGITUDE'\'']).copy()
overlap_gdf = gpd.GeoDataFrame(
    overlap_export,
    geometry=gpd.points_from_xy(overlap_export.LONGITUDE, overlap_export.LATITUDE),
    crs=\"EPSG:4326\"
)
overlap_gdf = overlap_gdf.rename(columns={'\''ON STREET NAME'\'': '\''street'\'', '\''Data Type'\'': '\''kind'\''})
overlap_gdf[['\''street'\'', '\''kind'\'', '\''geometry'\'']].to_file(\"export_nyc-crash-311-overlap.geojson\", driver=\"GeoJSON\")
print(f\"Exported {len(overlap_gdf)} 311-overlap points\")

# --- Export 3: ZIP Risk (all NYC zip polygons, tagged with risk category) ---
robust_zips = set(core)
flagged_zips = set(density_df[density_df['\''Risk Category'\''] == '\''Low Population, High Accidents'\'']['\''zipcode'\''])

nyc_zip_export = nyc_zip.copy()
nyc_zip_export['\''zipcode'\''] = nyc_zip_export['\''postalcode'\''].astype(str).str.zfill(5)

zip_export = nyc_zip_export[['\''zipcode'\'', '\''geometry'\'']].merge(
    density_df[['\''zipcode'\'', '\''ACCIDENT_COUNT'\'', '\''population_clean'\'']],
    on='\''zipcode'\'', how='\''left'\''
)

def categorize(z):
    if z in robust_zips:
        return '\''robust-high'\''
    if z in flagged_zips:
        return '\''borderline'\''
    return '\''normal'\''

zip_export['\''risk_category'\''] = zip_export['\''zipcode'\''].apply(categorize)
zip_export = zip_export.rename(columns={'\''ACCIDENT_COUNT'\'': '\''accident_count'\'', '\''population_clean'\'': '\''population'\''})
zip_export[['\''zipcode'\'', '\''risk_category'\'', '\''accident_count'\'', '\''population'\'', '\''geometry'\'']].to_file(
    \"export_nyc-crash-zip-risk.geojson\", driver=\"GeoJSON\"
)
print(f\"Exported {len(zip_export)} zip polygons, {(zip_export['\''risk_category'\''] != '\''normal'\'').sum()} flagged\")
'''
code_cell = {
    'cell_type': 'code',
    'execution_count': None,
    'metadata': {},
    'outputs': [],
    'source': code_source.splitlines(keepends=True)
}

nb['cells'].append(md_cell)
nb['cells'].append(code_cell)
json.dump(nb, open(nb_path, 'w', encoding='utf-8'), indent=1)
print('Appended 2 cells, notebook now has', len(nb['cells']), 'cells')
"
```

Expected output: `Appended 2 cells, notebook now has 111 cells`

- [ ] **Step 2: Execute the notebook**

```bash
cd "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio"
jupyter nbconvert --to notebook --execute --inplace --ExecutePreprocessor.kernel_name=sds --ExecutePreprocessor.timeout=1800 Karim_MV_Collision_FinalProj.ipynb
```

This re-runs the entire notebook (all 45 previously-executed cells plus the 2 new ones) in the `sds` conda environment/kernel — the same command the project's CHANGELOG already establishes as the working method. Expect several minutes given the crash/311/traffic-volume CSV sizes.

- [ ] **Step 3: Verify 0 error cells and inspect the export output**

```bash
python3 -c "
import json
nb_path = r'C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\Karim_MV_Collision_FinalProj.ipynb'
nb = json.load(open(nb_path, encoding='utf-8'))
errors = [i for i, c in enumerate(nb['cells']) if c['cell_type']=='code' for o in c.get('outputs', []) if o.get('output_type')=='error']
print('error cells:', errors)
last_code = [c for c in nb['cells'] if c['cell_type']=='code'][-1]
for o in last_code.get('outputs', []):
    if o.get('output_type')=='stream':
        print(''.join(o.get('text', [])))
"
```

Expected: `error cells: []`, and the printed stream output shows the 3 `Exported ...` lines from Step 1's code (bike-gap point count with 10 streets, 311-overlap point count, zip polygon count with 10 flagged — should read `Exported 262 zip polygons, 10 flagged`).

- [ ] **Step 4: Verify the 3 output files exist and are valid**

```bash
python3 -c "
import json
import os
d = r'C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio'
for name in ['export_nyc-crash-bike-gaps.geojson', 'export_nyc-crash-311-overlap.geojson', 'export_nyc-crash-zip-risk.geojson']:
    p = os.path.join(d, name)
    data = json.load(open(p, encoding='utf-8'))
    print(name, len(data['features']), 'features', os.path.getsize(p), 'bytes')
"
```

Expected: bike-gaps has 1,000+ point features across 10 distinct streets (roughly matching the sum of Cell 58's top-10 counts: 497+139+127+125+123+123+113+98+98+94 = 1,137), 311-overlap has thousands of points, zip-risk has exactly 262 polygon features.

- [ ] **Step 5: Update CHANGELOG.md and commit**

Append to `C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\CHANGELOG.md`, under a new dated entry following the file's existing style (see the file's own entries for the exact heading format `### YYYY-MM-DD — <title>`), documenting: added Section 8 portfolio data export cells, re-ran the notebook clean end-to-end, produced the 3 GeoJSON files consumed by the new portfolio page.

```bash
cd "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio"
git add Karim_MV_Collision_FinalProj.ipynb CHANGELOG.md
git commit -m "Add Section 8: portfolio data export cells for the new site page"
git push
```

---

## Task 3: Copy exports into the portfolio and build js/nyc-crash-data.js

**Files:**
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\data\nyc-crash-bike-gaps.geojson`
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\data\nyc-crash-311-overlap.geojson`
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\data\nyc-crash-zip-risk.geojson`
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\js\nyc-crash-data.js`

**Interfaces:**
- Consumes: the 3 `export_*.geojson` files from Task 2
- Produces: `window.CRASH_BIKE_GAPS`, `window.CRASH_311_OVERLAP`, `window.CRASH_ZIP_RISK` globals (same pattern as `js/data.js`'s `window.SCENARIOS`/`window.ADK_BOUNDARY`/`window.DEC_LANDS`), consumed by Task 4's `js/nyc-crash-map.js`

- [ ] **Step 1: Copy the exported files**

```bash
cp "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio/export_nyc-crash-bike-gaps.geojson" "C:/Users/karim/Desktop/Karim/Portfolio/data/nyc-crash-bike-gaps.geojson"
cp "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio/export_nyc-crash-311-overlap.geojson" "C:/Users/karim/Desktop/Karim/Portfolio/data/nyc-crash-311-overlap.geojson"
cp "C:/Users/karim/Desktop/Karim/Hunter/GTECH731 - GeoComp 1/MV_Collision_Portfolio/export_nyc-crash-zip-risk.geojson" "C:/Users/karim/Desktop/Karim/Portfolio/data/nyc-crash-zip-risk.geojson"
```

- [ ] **Step 2: Build js/nyc-crash-data.js**

```bash
python3 -c "
import json
d = r'C:\Users\karim\Desktop\Karim\Portfolio\data'
out_path = r'C:\Users\karim\Desktop\Karim\Portfolio\js\nyc-crash-data.js'
mapping = [
    ('nyc-crash-bike-gaps.geojson', 'CRASH_BIKE_GAPS'),
    ('nyc-crash-311-overlap.geojson', 'CRASH_311_OVERLAP'),
    ('nyc-crash-zip-risk.geojson', 'CRASH_ZIP_RISK'),
]
with open(out_path, 'w', encoding='utf-8') as f:
    for fname, varname in mapping:
        data = json.load(open(d + '\\\\' + fname, encoding='utf-8'))
        f.write('window.' + varname + ' = ' + json.dumps(data, separators=(',', ':')) + ';\n')
print('wrote', out_path)
"
```

- [ ] **Step 3: Verify the JS file parses and has the right variables**

```bash
python3 -c "
import re
src = open(r'C:\Users\karim\Desktop\Karim\Portfolio\js\nyc-crash-data.js', encoding='utf-8').read()
for var in ['CRASH_BIKE_GAPS', 'CRASH_311_OVERLAP', 'CRASH_ZIP_RISK']:
    assert ('window.' + var + ' = ') in src, var + ' missing'
print('all 3 globals present,', len(src), 'bytes total')
"
```

Expected: `all 3 globals present, <N> bytes total` with no `AssertionError`.

---

## Task 4: Write js/nyc-crash-map.js

**Files:**
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\js\nyc-crash-map.js`

**Interfaces:**
- Consumes: `window.CRASH_BIKE_GAPS`, `window.CRASH_311_OVERLAP`, `window.CRASH_ZIP_RISK` (from Task 3), DOM elements `#map`, `#scenarioBtns`, `#infoPanel` (from Task 5's HTML, same ids `js/sdss-map.js` already uses), Leaflet global `L`
- Produces: populates `#scenarioBtns` with 3 buttons and renders the initial "Bike Lane Gaps" layer on load — no exports, this is a page-level script like `js/sdss-map.js`

- [ ] **Step 1: Write the file**

```javascript
/* NYC VRU crash analysis — client-side Leaflet map, 3-layer toggle.
   Reads window.CRASH_BIKE_GAPS, window.CRASH_311_OVERLAP, window.CRASH_ZIP_RISK from nyc-crash-data.js. */
(function () {
  "use strict";

  var LAYERS = [
    { key: "bike-gaps", label: "Bike Lane Gaps" },
    { key: "311-overlap", label: "311 Overlap Zones" },
    { key: "zip-risk", label: "High-Risk ZIP Codes" }
  ];

  var NUM = function (n, d) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: d || 0 }); };

  var map = L.map("map", { scrollWheelZoom: false }).setView([40.72, -73.95], 11);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap &copy; CARTO", maxZoom: 19, subdomains: "abcd"
  }).addTo(map);

  var currentLayer = null;

  function clearLayer() {
    if (currentLayer) { map.removeLayer(currentLayer); currentLayer = null; }
  }

  function stat(k, v) {
    return '<div class="stat"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>';
  }

  function setActive(key) {
    Array.prototype.forEach.call(document.querySelectorAll(".scenario-btns button"), function (b) {
      b.classList.toggle("active", b.dataset.s === key);
    });
  }

  function showBikeGaps() {
    clearLayer();
    var feats = window.CRASH_BIKE_GAPS.features;
    currentLayer = L.geoJSON(window.CRASH_BIKE_GAPS, {
      pointToLayer: function (f, latlng) {
        return L.circleMarker(latlng, { radius: 4, color: "#7a3712", fillColor: "#e08a4f", fillOpacity: 0.7, weight: 1 });
      },
      onEachFeature: function (f, layer) {
        var p = f.properties;
        layer.bindPopup("<strong>" + p.street + "</strong><br>" + NUM(p.dist_m, 0) + "m from nearest bike lane");
      }
    }).addTo(map);
    try { map.fitBounds(currentLayer.getBounds().pad(0.1)); } catch (e) {}

    var byStreet = {};
    feats.forEach(function (f) {
      var s = f.properties.street;
      (byStreet[s] = byStreet[s] || []).push(f.properties.dist_m);
    });
    var rows = Object.keys(byStreet).map(function (s) {
      var ds = byStreet[s];
      var mean = ds.reduce(function (a, b) { return a + b; }, 0) / ds.length;
      return { street: s, count: ds.length, mean: mean };
    }).sort(function (a, b) { return b.count - a.count; });

    var html = '<div class="sc-label">Bike Lane Gaps</div>' +
      '<div class="sc-desc">Accidents more than 100m from the nearest bike lane, clustered on 10 streets — candidates for new infrastructure.</div>';
    rows.forEach(function (r) {
      html += stat(r.street, r.count + " accidents &middot; " + NUM(r.mean, 0) + "m avg gap");
    });
    html += '<div class="weights">Validated 3 ways: 9/10 streets threshold-stable across 50–50m cutoff variants, 72.5% overlap with NYC DOT Vision Zero priority corridors, moderate traffic-volume confound (Spearman &rho;=0.32) disclosed rather than ignored.</div>';
    document.getElementById("infoPanel").innerHTML = html;
    setActive("bike-gaps");
  }

  function showOverlap() {
    clearLayer();
    var colors = {
      "Bike Accident": "#d64545",
      "Blocked Lane 311 Complaint": "#3d6b66",
      "Overlap (Accident + Complaint)": "#c99a3b"
    };
    currentLayer = L.geoJSON(window.CRASH_311_OVERLAP, {
      pointToLayer: function (f, latlng) {
        var isOverlap = f.properties.kind.indexOf("Overlap") === 0;
        return L.circleMarker(latlng, {
          radius: isOverlap ? 6 : 3,
          color: colors[f.properties.kind] || "#999",
          fillColor: colors[f.properties.kind] || "#999",
          fillOpacity: 0.65,
          weight: isOverlap ? 1.5 : 1
        });
      },
      onEachFeature: function (f, layer) {
        layer.bindPopup("<strong>" + f.properties.street + "</strong><br>" + f.properties.kind);
      }
    }).addTo(map);
    try { map.fitBounds(currentLayer.getBounds().pad(0.1)); } catch (e) {}

    var overlapByStreet = {};
    window.CRASH_311_OVERLAP.features.forEach(function (f) {
      if (f.properties.kind.indexOf("Overlap") === 0) {
        var s = f.properties.street;
        overlapByStreet[s] = (overlapByStreet[s] || 0) + 1;
      }
    });
    var topOverlap = Object.keys(overlapByStreet)
      .map(function (s) { return { street: s, count: overlapByStreet[s] }; })
      .sort(function (a, b) { return b.count - a.count; })
      .slice(0, 8);

    var html = '<div class="sc-label">311 Overlap Zones</div>' +
      '<div class="sc-desc">Where "Blocked Bike Lane" 311 complaints and bike accidents cluster in the same location — illegal parking as a direct safety hazard.</div>' +
      stat("Correlation (accidents vs. complaints)", "r = 0.43") +
      '<div class="weights">Top overlap streets:</div>';
    topOverlap.forEach(function (r) {
      html += stat(r.street, r.count + " overlap points");
    });
    document.getElementById("infoPanel").innerHTML = html;
    setActive("311-overlap");
  }

  function showZipRisk() {
    clearLayer();
    var fillColors = { "robust-high": "#b5541f", "borderline": "#c99a3b", "normal": "#e2ded1" };
    currentLayer = L.geoJSON(window.CRASH_ZIP_RISK, {
      style: function (f) {
        var cat = f.properties.risk_category;
        return {
          color: cat === "normal" ? "#b8b2a0" : "#3b2f26",
          weight: cat === "normal" ? 0.5 : 1.5,
          fillColor: fillColors[cat] || "#e2ded1",
          fillOpacity: cat === "normal" ? 0.15 : 0.6
        };
      },
      onEachFeature: function (f, layer) {
        var p = f.properties;
        layer.bindPopup(
          "<strong>" + p.zipcode + "</strong><br>" +
          (p.risk_category === "normal" ? "Not flagged" : p.risk_category.replace("-", " ")) +
          (p.accident_count ? "<br>" + NUM(p.accident_count, 0) + " accidents" : "")
        );
      }
    }).addTo(map);
    map.setView([40.72, -73.95], 11);

    var robust = [], borderline = [];
    window.CRASH_ZIP_RISK.features.forEach(function (f) {
      var p = f.properties;
      if (p.risk_category === "robust-high") robust.push(p);
      else if (p.risk_category === "borderline") borderline.push(p);
    });
    robust.sort(function (a, b) { return (b.accident_count || 0) - (a.accident_count || 0); });
    borderline.sort(function (a, b) { return (b.accident_count || 0) - (a.accident_count || 0); });

    var html = '<div class="sc-label">High-Risk ZIP Codes</div>' +
      '<div class="sc-desc">ZIP codes with disproportionately high bike-accident counts relative to population.</div>' +
      '<div class="weights">Robust across all threshold variants tested:</div>';
    robust.forEach(function (p) { html += stat(p.zipcode, NUM(p.accident_count, 0) + " accidents"); });
    html += '<div class="weights">Borderline (flagged at the original cutoff, but not stable across nearby thresholds):</div>';
    borderline.forEach(function (p) { html += stat(p.zipcode, NUM(p.accident_count, 0) + " accidents"); });
    html += '<div class="weights">A sensitivity check across nearby percentile cutoffs found only the 5 robust codes hold up consistently — the 5 borderline codes are a lower-confidence watch list, not equally actionable.</div>';
    document.getElementById("infoPanel").innerHTML = html;
    setActive("zip-risk");
  }

  var SHOWERS = { "bike-gaps": showBikeGaps, "311-overlap": showOverlap, "zip-risk": showZipRisk };

  var wrap = document.getElementById("scenarioBtns");
  LAYERS.forEach(function (l) {
    var b = document.createElement("button");
    b.textContent = l.label;
    b.dataset.s = l.key;
    b.onclick = function () { SHOWERS[l.key](); };
    wrap.appendChild(b);
  });

  showBikeGaps();
})();
```

- [ ] **Step 2: Syntax-check the file**

```bash
node --check "C:/Users/karim/Desktop/Karim/Portfolio/js/nyc-crash-map.js"
```

Expected: no output (exit code 0 means valid syntax).

---

## Task 5: Write projects/nyc-vru-crash.html

**Files:**
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\projects\nyc-vru-crash.html`

**Interfaces:**
- Consumes: `../css/style.css`, `../css/jank.css`, `../js/tailwind-config.js` (all unmodified), `../js/nyc-crash-data.js` + `../js/nyc-crash-map.js` (Tasks 3-4), the GitHub repo URL from Task 1
- Produces: DOM ids `#map`, `#scenarioBtns`, `#infoPanel` that Task 4's script binds to (must match exactly)

- [ ] **Step 1: Write the file**

Replace `<REPO_URL>` in the Methodology section with the exact URL recorded in Task 1, Step 4.

```html
<!doctype html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>NYC Vulnerable Road User Crash Analysis — Karim Nabahi</title>
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://code.iconify.design/iconify-icon/1.0.7/iconify-icon.min.js"></script>
  <script src="../js/tailwind-config.js"></script>
  <link rel="stylesheet" href="../css/jank.css">
  <style>
    .meta-stat { border-width: 2px; border-style: solid; border-color: #fff #4a4a4a #4a4a4a #fff; padding: 10px 16px; }
    .meta-stat .k { font-size: .7rem; text-transform: uppercase; letter-spacing: 1px; opacity: .7; }
    .meta-stat .v { font-weight: bold; }
    .explorer { border: 8px solid #b5541f !important; border-radius: 0 !important; }
    .validation-box { border-width: 4px; border-style: solid; padding: 20px; }
  </style>
</head>
<body>
  <div class="jank-container">
    <header class="top-bar">
      <span class="icon-badge icon-badge-lg icon-badge-oxblood"><iconify-icon icon="mdi:compass-outline" class="text-3xl text-jank-yellow"></iconify-icon></span>
      <h1>KARIM NABAHI</h1>
    </header>
    <aside class="sidebar">
      <nav class="flex flex-col">
        <a href="../index.html#projects">PROJECTS</a>
        <a href="../index.html#about">ABOUT ME</a>
        <a href="../resume.html">MY RESUME</a>
        <a href="../index.html#contact">CONTACT</a>
      </nav>
      <div class="mt-10">
        <span class="icon-badge icon-badge-sm icon-badge-dark"><iconify-icon icon="mdi:bike" class="text-2xl text-white/50"></iconify-icon></span>
        <p class="text-xs mt-2 font-mono">A REAL PROJECT!</p>
      </div>
    </aside>
    <main class="bg-white">

      <section class="jank-section bg-[#1c2321] text-white">
        <div class="text-pad">
        <span class="uppercase text-xs tracking-widest text-jank-yellow font-bold">Crash Data Analysis &amp; Spatial Statistics</span>
        <h2 class="font-bold text-5xl my-4">NYC VULNERABLE ROAD USER CRASH ANALYSIS</h2>
        <p class="text-xl leading-relaxed max-w-3xl">NYC has multiple independent signals about where cyclist and pedestrian risk concentrates — infrastructure gaps, resident complaints, demographic exposure — collected by different city agencies and never cross-referenced. This project puts all three on one map, then stress-tests the resulting recommendations before trusting them.</p>
        <div class="flex flex-wrap gap-4 mt-8">
          <div class="meta-stat"><div class="k">Role</div><div class="v">Analysis &amp; visualization</div></div>
          <div class="meta-stat"><div class="k">Tools</div><div class="v">Python, GeoPandas, Leaflet</div></div>
          <div class="meta-stat"><div class="k">Method</div><div class="v">Spatial joins, hypothesis testing</div></div>
          <div class="meta-stat"><div class="k">Course</div><div class="v">GTECH 731, Hunter College</div></div>
        </div>
        </div>
      </section>

      <section class="jank-section bg-[#3b2f26] text-white">
        <div class="text-pad">
        <div class="section-header mb-8">
          <iconify-icon icon="mdi:map-marker-question-outline" class="text-4xl text-orange-400"></iconify-icon>
          <h2 class="font-bold text-4xl tracking-widest">THE PROBLEM</h2>
        </div>
        <p class="text-lg leading-relaxed max-w-3xl mb-10">Bike-lane gap streets, blocked-lane 311 complaints, and demographic risk are three separate signals collected by three different parts of city government — none of them cross-referenced against the others. Each one alone is suggestive; put on the same map, they either corroborate or contradict each other, which is exactly what a decision-maker needs before acting on any one of them.</p>
        </div>

        <!-- INTERACTIVE MAP (kept structurally identical for js/nyc-crash-map.js) -->
        <div class="explorer">
          <div class="toolbar">
            <h3>Explore the crash risk layers</h3>
            <p>Pick a layer to see accident clusters, complaint overlaps, and demographic risk across NYC.</p>
          </div>
          <div class="scenario-btns" id="scenarioBtns"></div>
          <div class="map-wrap">
            <div id="map"></div>
            <aside class="info-panel" id="infoPanel"></aside>
          </div>
        </div>
      </section>

      <section class="jank-section bg-[#7c8b5e] text-white">
        <div class="text-pad">
        <div class="section-header mb-8">
          <iconify-icon icon="mdi:cog-outline" class="text-4xl text-jank-yellow"></iconify-icon>
          <h2 class="font-bold text-4xl tracking-widest">HOW IT WORKS</h2>
        </div>
        <p class="text-lg leading-relaxed max-w-3xl mb-4">Each layer is its own small pipeline. <strong>Bike Lane Gaps:</strong> every cyclist-involved crash (2016&ndash;2025) is spatially joined to the nearest bike lane in projected meters (EPSG:32618); accidents over 100m away are grouped by street to find the top 10 off-network candidates for new infrastructure. <strong>311 Overlap:</strong> "Blocked Bike Lane" 311 complaints and bike accidents are each snapped to a ~110m grid cell; cells containing both are flagged as overlap zones. <strong>ZIP Risk:</strong> accident counts per ZIP code are compared against population, flagging codes in the bottom 40th population percentile but top 65th accident percentile — then re-checked at two nearby percentile cutoffs to separate the robust signal from threshold noise.</p>
        <p class="text-lg leading-relaxed max-w-3xl mb-8">All three pipelines run on the same underlying 10-year NYC crash dataset (2016&ndash;2025), cross-referenced against NYC Open Data's bike route network, 311 service requests, ZIP-code population figures, and NYC DOT's Vision Zero priority corridors.</p>

        <div class="section-header mb-8">
          <iconify-icon icon="mdi:chart-box-outline" class="text-4xl text-jank-yellow"></iconify-icon>
          <h2 class="font-bold text-4xl tracking-widest">WHAT THE RESULTS SHOW</h2>
        </div>
        <p class="text-lg leading-relaxed max-w-3xl mb-4">A clear "one block over" effect shows up in the bike lane data: accidents cluster 50&ndash;120m from existing lanes rather than right on top of them, often on a one-way street missing a lane on its opposite-direction neighbor. The 10 streets with the most off-network accidents — led by Broadway, Fulton Street, and 3rd Avenue — are the strongest candidates for closing that gap.</p>
        <p class="text-lg leading-relaxed max-w-3xl">Community-reported infrastructure failures back this up: streets with more "Blocked Bike Lane" 311 complaints also see more accidents (r = 0.43), pointing at illegal parking as a direct, fixable hazard. And of the 10 ZIP codes originally flagged as disproportionately high-risk relative to their population, a sensitivity check found only 5 hold up across nearby threshold choices — <strong>10001, 10012, 10013, 10017, and 11232</strong> — so outreach and infrastructure review should prioritize those 5 first, treating the other 5 as a lower-confidence watch list rather than an equally-actionable list.</p>
        </div>
      </section>

      <section class="jank-section bg-[#f2ead9] text-black">
        <div class="text-pad">
        <div class="section-header mb-8">
          <iconify-icon icon="mdi:shield-check-outline" class="text-4xl text-blue-600"></iconify-icon>
          <h2 class="font-bold text-4xl tracking-widest">VALIDATING THE RECOMMENDATION</h2>
        </div>
        <p class="text-lg leading-relaxed max-w-3xl mb-8">Before treating the top-10 off-network street list as more than a raw tally, it was checked three independent ways.</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="validation-box frame-gold bg-white">
            <span class="uppercase text-xs tracking-widest font-bold text-[#8f6b1f]">Threshold Sensitivity</span>
            <div class="text-3xl font-bold my-2">9 of 10 streets</div>
            <p class="text-sm">Robust across 50m and 150m cutoff variants of the original 100m threshold. Only Linden Boulevard is threshold-sensitive — it drops out at 50m, replaced by Myrtle Avenue.</p>
          </div>
          <div class="validation-box frame-teal bg-white">
            <span class="uppercase text-xs tracking-widest font-bold text-[#223d39]">Vision Zero Cross-Check</span>
            <div class="text-3xl font-bold my-2">72.5%</div>
            <p class="text-sm">of the top-10 streets' off-network accidents sit on a DOT-designated Vision Zero Priority Corridor — independent external corroboration from NYC DOT's own dataset, ranging from 100% on Nostrand/Bushwick Avenues down to 53% on Broadway.</p>
          </div>
          <div class="validation-box frame-oxblood bg-white">
            <span class="uppercase text-xs tracking-widest font-bold text-[#3f211a]">Confounding Check</span>
            <div class="text-3xl font-bold my-2">&rho; = 0.32</div>
            <p class="text-sm">Spearman correlation (p &lt; 0.0001, 406 of 2,388 streets matched to a monitored traffic location) between off-network accident counts and mean traffic volume — a real but moderate confound, disclosed rather than hidden, alongside its partial (17%) match-rate coverage.</p>
          </div>
        </div>
        </div>
      </section>

      <section class="jank-section bg-white text-black">
        <div class="text-pad">
        <div class="section-header mb-8">
          <iconify-icon icon="mdi:book-open-page-variant-outline" class="text-4xl text-blue-600"></iconify-icon>
          <h2 class="font-bold text-4xl tracking-widest">METHODOLOGY / GROUNDING</h2>
        </div>
        <p class="text-lg leading-relaxed max-w-3xl mb-8">This page summarizes findings from a 45-cell analysis notebook covering 10 years of NYC crash data (2016&ndash;2025), weather correlation, bike-lane proximity, traffic-volume-normalized risk scoring with spatial-autocorrelation testing, 311 complaint cross-referencing, and ZIP-code demographic risk — including an honestly-disclosed negative result (a Local Moran's I hotspot finding that did not survive multiple-comparisons correction). There's no standalone paper for this one, unlike the Adirondack project — the full notebook is the primary source.</p>
        <div class="yellow-callout">
          <a href="<REPO_URL>" target="_blank" rel="noopener" class="classic-link font-bold text-lg">CLICK HERE TO VIEW THE FULL NOTEBOOK ON GITHUB!</a>
        </div>
        </div>
      </section>

    </main>
  </div>
  <footer class="text-center py-8 font-mono text-sm uppercase">
    <a href="../index.html" class="classic-link">&larr; Back to projects</a> &bull;
    &copy; <span id="yr"></span> Karim Nabahi &bull; Best viewed in Netscape Navigator 4.0
  </footer>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="../js/nyc-crash-data.js"></script>
  <script src="../js/nyc-crash-map.js"></script>
  <script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
</body>
</html>
```

- [ ] **Step 2: Serve locally and verify the page loads with no console errors**

```bash
cd "C:/Users/karim/Desktop/Karim/Portfolio" && npx http-server -p 8081 -c-1
```

(If port 8081 is already in use from a prior session, that's fine — reuse it.) Navigate to `http://localhost:8081/projects/nyc-vru-crash.html`, take a screenshot, and read the browser console. Expected: page renders with the jank header/sidebar chrome, the meta-stat badges, the 3-box validation section, and a live Leaflet map defaulting to the "Bike Lane Gaps" layer with points and a populated info panel on the right. No red console errors (a missing-tile 404 from the CARTO basemap is not an error to worry about; a `CRASH_BIKE_GAPS is not defined` or similar is).

- [ ] **Step 3: Click through all 3 layer buttons and verify each renders**

Click "311 Overlap Zones" — expect 3-colored points (red/teal/gold) and an info panel showing `r = 0.43` plus a top-overlap-streets list. Click "High-Risk ZIP Codes" — expect a citywide choropleth (light gray for unflagged ZIPs, gold for borderline, rust for robust-high) and an info panel listing the 5 robust and 5 borderline ZIP codes by name.

---

## Task 6: Thumbnail image + new project card on index.html

**Files:**
- Create: `C:\Users\karim\Desktop\Karim\Portfolio\assets\nyc-crash-thumb.png`
- Modify: `C:\Users\karim\Desktop\Karim\Portfolio\index.html` (add one new project card after the existing SDSS card, inside the `#projects` section)

**Interfaces:**
- Consumes: the live page from Task 5 (for the thumbnail screenshot)

- [ ] **Step 1: Capture the thumbnail**

With the local server still running (`http://localhost:8081`), navigate to `http://localhost:8081/projects/nyc-vru-crash.html`, click "High-Risk ZIP Codes" (the citywide choropleth is the most legible locator-map view), wait for the map tiles to load, then screenshot just the map area and crop/save to `assets/nyc-crash-thumb.png` at a 3:2 aspect ratio (matching `assets/sdss-thumb.png`'s convention — the index.html card wraps it in a `style="aspect-ratio: 3 / 2;"` container that crops via `object-fit: cover`, so an exact 3:2 source crop isn't mandatory, but should be close to avoid heavy cropping).

- [ ] **Step 2: Add the new project card to index.html**

Insert this new card immediately after the closing `</div>` of the existing SDSS card (the one with `alt="Locator map for the 2,500 Acres in the Adirondacks project"`), still inside `<section id="projects" class="jank-section bg-[#3b2f26] text-white">`, before that section's closing `</section>`:

```html
        <div class="frame-teal bg-white text-black overflow-hidden flex flex-col md:flex-row items-start mt-6">
          <div class="w-full md:w-[45%] flex-shrink-0" style="border-right:4px solid #3d6b66; aspect-ratio: 3 / 2;">
            <img src="assets/nyc-crash-thumb.png" class="w-full h-full object-cover block" alt="Citywide ZIP-code risk map for the NYC Vulnerable Road User Crash Analysis project">
          </div>
          <div class="p-4 flex flex-col flex-1">
            <span class="text-red-600 font-bold uppercase text-xs mb-1">Crash Data Analysis &bull; Python + GeoPandas</span>
            <h3 class="text-2xl font-bold mb-2 italic">NYC Vulnerable Road User Crash Analysis</h3>
            <p class="mb-3">Cross-referencing bike-lane infrastructure gaps, 311 complaints, and ZIP-code demographic risk on one map &mdash; then validating the resulting recommendations against NYC DOT's own Vision Zero data before trusting them.</p>
            <a href="projects/nyc-vru-crash.html" class="classic-link font-bold mb-3 block underline">Explore the interactive map &gt;&gt;</a>
            <div class="flex flex-wrap gap-x-6 gap-y-1 mt-auto">
              <div class="tool-tag font-bold text-sm"><iconify-icon icon="mdi:play" class="tool-tag-icon"></iconify-icon> Python / GeoPandas</div>
              <div class="tool-tag font-bold text-sm"><iconify-icon icon="mdi:play" class="tool-tag-icon"></iconify-icon> Spatial Joins</div>
              <div class="tool-tag font-bold text-sm"><iconify-icon icon="mdi:play" class="tool-tag-icon"></iconify-icon> Hypothesis Testing</div>
              <div class="tool-tag font-bold text-sm"><iconify-icon icon="mdi:play" class="tool-tag-icon"></iconify-icon> Leaflet</div>
            </div>
          </div>
        </div>
```

- [ ] **Step 3: Verify visually**

Reload `http://localhost:8081/index.html`, screenshot the Selected Work / Projects section. Expected: two cards stacked, both in the same `.frame-teal` bordered style with the raised bevel from the earlier bevel pass, the new one showing the ZIP-risk thumbnail and linking to `projects/nyc-vru-crash.html`. Click the new "Explore the interactive map >>" link and confirm it lands on the new page.

- [ ] **Step 4: Stop the local server**

If it was started fresh for this task (not a pre-existing session server), stop it; otherwise leave it running.

---

## Post-plan note for the user

Two figures in this plan were corrected from the original design spec after re-checking the notebook directly: the Section 4.11 confounding-check Spearman correlation is **ρ=0.32** (not 0.298) and its match rate is **17.0%** (not ~16%). The spec's other figures were all confirmed accurate. Also flagging again: this new page does not get a French translation or lang-toggle, since the original spec predates the site's EN/FR feature and doesn't call for it — a deliberate scope decision, not an oversight, but worth a conscious yes/no from the user rather than silent inconsistency across the site's pages.
