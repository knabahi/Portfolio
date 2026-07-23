# NYC Vulnerable Road User Crash Analysis — Portfolio Page Design

> **Revised 2026-07-23** to fold in the three council validation gates closed
> 2026-07-17 for the Section 3.1.7 top-10 recommendation (threshold
> sensitivity, Vision Zero cross-check, confounding check) and the Section 7
> recommendation copy revised since this spec was first written. See
> "Validating the Recommendation" (new Page Structure item 6) and the updated Open
> Dependencies / Deferred Decisions below. Everything else from the original
> 2026-07-16 spec still holds.

## Purpose

Add a second project page to the portfolio site, showcasing the NYC VRU
(pedestrian/cyclist) crash analysis currently living at
`C:\Users\karim\Desktop\Karim\Hunter\GTECH731 - GeoComp 1\MV_Collision_Portfolio\Karim_MV_Collision_FinalProj.ipynb`.
It must match the existing Adirondack SDSS page
(`projects/adk-sdss.html`) in visual template and interactivity level — a
live client-side Leaflet map, not static screenshots — since that page
already sets the bar for what a project page on this site looks like.

## Source Material (grounded facts, not assumptions)

The notebook's 7 sections and their status as of this design:
1. Data validation (BROADWAY street-name whitespace/casing bug found and fixed)
2. Weather impact (dry-day fatality finding; weather data covers 2025 only, disclosed as a limitation)
3. Bike lane proximity — the "one block over" finding: accidents cluster 50-120m from existing bike lanes, and the top 10 off-network streets are identified as lane-expansion candidates
4. Traffic-volume risk scoring — Welch's t-test shows bike lanes correlate with lower risk scores; a Local Moran's I spatial-clustering test found 22/500 segments "significant" at raw p<0.05, but **0/500 survived Benjamini-Hochberg FDR correction** — an honestly-disclosed negative result
5. 311 "blocked bike lane" complaints cross-referenced with bike accidents (r=0.43 correlation); overlap-zone points already computed in the notebook (`combined_map_df` / `overlap_points`)
6. ZIP-code demographic risk — 10 ZIP codes originally flagged as high-risk (bottom 40% population / top 65th percentile accidents); a sensitivity check found only 5 are robust across nearby thresholds: **10001, 10012, 10013, 10017, 11232**
7. Recommendations, limitations, future work

## Page Structure

Mirrors `adk-sdss.html`'s section order and visual template (jank-container,
sidebar nav, `.jank-section` blocks, meta-stat badges, iconify icons,
Tailwind + custom CSS from `../css/style.css`):

1. **Hero** — title, one-line hook, meta-stat badges (Role: Analysis &
   visualization; Tools: Python, GeoPandas, Leaflet; Method: Spatial joins,
   hypothesis testing; Course: GTECH 731).
2. **THE PROBLEM** — NYC has multiple independent signals about where
   cyclist/pedestrian risk concentrates (infrastructure gaps, resident
   complaints, demographic exposure) collected by different agencies and
   never cross-referenced. This analysis puts them on one map. (Placeholder
   wording — refine copy during implementation, not a structural gap.)
3. **Interactive Explorer** — see below.
4. **HOW IT WORKS** — brief description of the data pipeline and methods
   used per layer. A flowchart-equivalent diagram image is optional/deferred
   (see Deferred Decisions) — the section works with text alone for v1.
5. **WHAT THE RESULTS SHOW** — narrative tying the three layers together,
   plus the concrete recommendations pulled fresh from the notebook's current
   Section 7.1 at implementation time (bike lane gap closure, ZIP-code
   targeting led by the robust 5, 311 enforcement). That copy has been
   revised since this spec was first written (post-FDR-correction) — do not
   reuse any Section 7.1 wording quoted in this spec's earlier draft, pull
   live from the notebook.
6. **Validating the Recommendation** *(new)* — a dedicated section between
   "What the Results Show" and "Methodology/Grounding," giving the three
   2026-07-17 council validation gates their own visible spot rather than
   burying them in an info panel. Three boxes, each visually distinct
   (following the SDSS page's per-topic colored-section pattern):
   - **Threshold Sensitivity** — headline stat: 9 of 10 streets robust across
     50m/150m cutoff variants (vs. the recommendation's native ~100m cutoff);
     takeaway: only Linden Boulevard is threshold-sensitive.
   - **Vision Zero Cross-Check** — headline stat: 72.5% of the top-10
     streets' off-network accidents sit on a DOT-designated Vision Zero
     Priority Corridor; takeaway: independent external corroboration from
     NYC DOT's own dataset.
   - **Confounding Check** — headline stat: Spearman ρ=0.298 (p<0.0001)
     between off-network accident counts and mean traffic volume; takeaway:
     a real but modest confound, disclosed alongside its partial coverage
     caveat (~16% street-name match rate).

   Explicitly out of scope for this section: the Section 4 LISA/FDR null
   finding (see Deferred Decisions) — it concerns a different analysis
   object (500 traffic-volume-monitored segments) than the Section 3.1.7
   street recommendation these three gates validate, and including it here
   would wrongly imply the two are about the same finding.
7. **Methodology / Grounding** — links out to the full notebook via GitHub
   (see Open Dependencies) since there is no PDF paper for this project,
   unlike Adirondack's.

## Interactive Explorer

Three toggle buttons (parallel to ADK's `scenario-btns`): **Bike Lane
Gaps**, **311 Overlap Zones**, **High-Risk ZIP Codes**. Clicking one swaps
the visible map layer and updates a right-side info panel (parallel to
ADK's `infoPanel`) with layer-specific stats and context:
- Bike Lane Gaps panel: the 10 off-network streets, gap distance stats
- 311 Overlap panel: r=0.43 correlation figure, top overlap streets
- ZIP Risk panel: the 5 robust vs. 5 borderline codes, with the sensitivity-
  check caveat stated directly in the panel copy (this is the natural,
  honest home for that nuance without needing a dedicated page section)

## Data Pipeline

Three small, purpose-built GeoJSON files (not raw source data), generated by
a new export script that reads from the notebook's already-computed
dataframes/logic:

1. `nyc-crash-bike-gaps.geojson` — the ~10 off-network streets + gap geometry (Section 3)
2. `nyc-crash-311-overlap.geojson` — overlap-zone points (Section 5's `combined_map_df`/`overlap_points`)
3. `nyc-crash-zip-risk.geojson` — ZIP polygons (from the existing `nyc-zip-code-tabulation-areas-polygons.geojson`) joined to the risk categorization (robust-high / borderline / normal)

Output location: `Portfolio/data/`. Wired up via new `js/nyc-crash-data.js`
(inlined GeoJSON, following the `js/data.js` pattern) and a new
`js/nyc-crash-map.js` (Leaflet layer-toggle logic, following the
`js/sdss-map.js` pattern). Neither existing JS file is modified — this is
purely additive, since the ADK page's map must keep working unchanged.

## New Page & Assets

- `projects/nyc-vru-crash.html` — new page, new file
- A new project card added to `index.html`'s "SELECTED WORK / PROJECTS"
  section, in the same `.frame-teal` card style as the existing one
- A new thumbnail image (locator-map screenshot) for that card, parallel to
  `assets/sdss-thumb.png`

## Open Dependencies

- `MV_Collision_Portfolio` (the analysis repo) currently has no git remote
  (confirmed still true as of 2026-07-23; `data/` is already gitignored, so
  pushing will not expose the large source CSVs — only the notebook,
  CHANGELOG, and research-notes). **Decision (2026-07-23): push it to a new
  public GitHub repo** so the Methodology section's "view full analysis"
  link has somewhere real to point, matching the resolution the user chose
  for this open item. Exact repo name/visibility to be confirmed with the
  user immediately before the push itself, since creating and pushing to a
  new public repo is a one-way, publicly-visible action taken separately
  from writing this spec.

## Deferred Decisions (explicitly deferred by the user, not gaps in this spec)

- **The null LISA/FDR finding (Section 4: 22 of 500 traffic-volume-monitored
  segments flagged as raw-significant hotspots, 0 survived Benjamini-Hochberg
  correction) stays deferred as of 2026-07-23**, reaffirmed after the user
  asked for the distinction to be spelled out: it's a different analysis
  object (500 risk-scored segments) than the Section 3.1.7 street
  recommendation the new "Validating the Recommendation" section covers.
  Section 4.10's related Vision Zero cross-check on those same 22 hotspots
  (no enrichment found, consistent with the FDR retraction) is likewise left
  out of the page — it stays in the notebook/CHANGELOG only.
- **Whether to build a flowchart-equivalent diagram** for the How It Works
  section. Still deferred as optional/non-blocking for a first version.

## Out of Scope for This Design

- Redesigning or modifying the existing Adirondack SDSS page
- Any change to the site's global nav, CSS theme, or `index.html` sections
  other than adding one new project card
- Making `MV_Collision_Portfolio`'s data files (the multi-hundred-MB CSVs)
  public or downloadable — only the small, pre-aggregated GeoJSON exports
  are published
