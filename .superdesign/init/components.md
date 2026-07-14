# Shared UI Primitives

No component library (no React/Vue/shadcn/etc.) — these are reusable CSS classes applied to plain HTML elements across pages. Full source CSS + example markup for each.

## Button (`.btn`, `.btn.secondary`)

```css
.btn {
  display: inline-block; background: var(--green); color: #fff; padding: 12px 22px;
  border-radius: 8px; font-weight: 600; margin-right: 12px;
}
.btn:hover { background: var(--green-dark); text-decoration: none; }
.btn.secondary { background: transparent; color: var(--green); border: 1.5px solid var(--green); }
```
Usage:
```html
<a class="btn" href="#projects">View projects</a>
<a class="btn secondary" href="#contact">Get in touch</a>
```
Two variants: solid green (primary) and outline green on transparent (secondary). No other button color/variant exists anywhere in the codebase.

## Project Card (`.card`, `.card .thumb`, `.card .body`, `.tags`, `.tag-chip`)

```css
.projects { display: grid; grid-template-columns: 1fr; gap: 24px; }
.card {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  overflow: hidden; display: grid; grid-template-columns: 1.1fr 1fr;
  transition: box-shadow .2s, transform .2s;
}
.card:hover { box-shadow: 0 12px 34px rgba(35,79,46,0.13); transform: translateY(-2px); }
.card .thumb { background: var(--green-light); min-height: 350px; background-size: cover; background-position: center; }
.card .body { padding: 30px; }
.card .body h3 { margin: 6px 0 10px; font-size: 1.45rem; }
.card .body p { color: var(--muted); margin: 0 0 16px; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
.tag-chip { background: var(--green-light); color: var(--green-dark); font-size: .78rem; font-weight: 600; padding: 4px 11px; border-radius: 20px; }
@media (max-width: 860px) { .card { grid-template-columns: 1fr; } .card .thumb { min-height: 220px; } }
```
Usage (from `index.html`):
```html
<a class="card" href="projects/adk-sdss.html" style="color:inherit">
  <div class="thumb" style="background-image:url('assets/sdss-thumb.png')"></div>
  <div class="body">
    <div class="eyebrow">Spatial Decision Support &middot; ArcGIS + Python</div>
    <h3>2,500 Acres in the Adirondacks</h3>
    <p>...</p>
    <span class="btn" style="padding:9px 18px">Explore the interactive map &rarr;</span>
    <div class="tags">
      <span class="tag-chip">ArcGIS Pro</span>
      <span class="tag-chip">Python / arcpy</span>
    </div>
  </div>
</a>
```
Whole card is a single `<a>`; left column is an image thumb (`background-image` + cover), right column is text/body; hover lifts card 2px and adds a soft green-tinted shadow. Only one card currently exists on the site.

## Eyebrow label (`.eyebrow`)
```css
.eyebrow { color: var(--green); font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; font-size: .8rem; }
```
Small green all-caps kicker label used above headings/section titles and inside cards.

## Section head (`.section-head`)
```css
.section-head { margin-bottom: 30px; }
.section-head h2 { font-size: 1.9rem; margin: 0 0 8px; }
.section-head p { color: var(--muted); margin: 0; }
```
Usage: `<div class="section-head"><div class="eyebrow">Selected Work</div><h2>Projects</h2><p>Applied spatial analysis...</p></div>`

## Prose block (`.prose`)
```css
.prose { max-width: 760px; }
.prose h2 { font-size: 1.6rem; margin: 44px 0 12px; }
.prose h3 { font-size: 1.15rem; margin: 26px 0 6px; }
.prose p { color: #33403a; }
```
Constrained-width long-form text column, used for About bio, Contact, and the entire Resume/project-page body copy.

## Resume entry (`.resume-entry`) — resume.html only
```css
.resume-entry { margin-bottom: 22px; }
.resume-entry .row { display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 4px 16px; }
.resume-entry .org { font-weight: 700; }
.resume-entry .loc, .resume-entry .dates { color: var(--muted); font-size: .9rem; white-space: nowrap; }
.resume-entry .role { font-style: italic; margin-top: 2px; }
.resume-entry ul { margin: 8px 0 0; padding-left: 1.2em; color: #33403a; }
.resume-entry ul li { margin-bottom: 4px; }
```
Usage:
```html
<div class="resume-entry">
  <div class="row"><span class="org">Vermont Youth Conservation Corps</span><span class="loc">Richmond, VT</span></div>
  <div class="row"><span class="role">Conservation Crew Leader</span><span class="dates">May &ndash; October 2025</span></div>
  <ul><li>...</li></ul>
</div>
```

## Skills grid (`.skills-grid`) — resume.html only
```css
.skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 8px; }
.skills-grid h4 { margin: 0 0 8px; font-size: .95rem; }
```
Three columns of `<h4>` category label + `.tags`/`.tag-chip` group (reuses the tag-chip primitive from the project card).

## Photo grid (`.photo-grid`) — index.html About section
```css
.photo-grid { display: flex; flex-direction: column; gap: 16px; }
.photo-grid img { width: 100%; height: auto; border-radius: 10px; border: 1px solid var(--border); display: block; }
```
Vertical stack of full-bleed (uncropped, natural aspect ratio) photos in a fixed-width side column next to prose text.

## Hero photo (`.hero-photo`) — index.html hero
```css
.hero-photo {
  height: auto; width: 100%; max-width: 340px; max-height: 340px; object-fit: contain;
  border-radius: 12px; border: 1px solid var(--border); display: block; justify-self: end;
}
```
Single photo capped at 340px on its long side, right-aligned in the hero grid, never cropped (object-fit: contain).

## Stat row (`.stat`) — project page info panel only
```css
.stat { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--border); font-size: .95rem; }
.stat .k { color: var(--muted); }
.stat .v { font-weight: 600; }
```
Label/value row with a dashed divider, used inside the Leaflet map's info panel (JS-generated, see `js/sdss-map.js`).
