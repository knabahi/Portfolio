# Extractable Components

This is a tiny hand-written static site with no component framework, so "extraction" here means noting which HTML/CSS blocks repeat across pages and are worth keeping visually identical in any redesign draft, rather than literal framework components.

## Layout Components (appear on most/all pages)

## NavBar
- Source: inline in `index.html` / `resume.html` / `projects/adk-sdss.html` (see `layouts.md` for full markup)
- Category: layout
- Description: sticky, blurred/translucent top bar with wordmark left, 4 text links right (Projects, About, Resume, Contact)
- Extractable props: `activeItem` (string, default: "home") — which nav link corresponds to current page
- Hardcoded: wordmark text ("Karim" + green "Nabahi"), all 4 link labels/hrefs, all CSS (sticky position, blur, border)

## Footer
- Source: inline in every page (two variants — see `layouts.md`)
- Category: layout
- Description: single-line muted footer, copyright + year + tech credit (home/resume) or back-link + copyright (project page)
- Extractable props: `showBackLink` (boolean, default: false)
- Hardcoded: all text, all CSS

## Basic Components (used across pages)

## Button
- Source: `.btn` / `.btn.secondary` classes in `css/style.css`
- Category: basic
- Description: solid-green primary button and outline-green secondary button, both pill-ish rounded (8px radius)
- Extractable props: `variant` (string: "primary" | "secondary", default: "primary"), `label` (string), `href` (string)
- Hardcoded: colors, padding, radius, hover state

## ProjectCard
- Source: `.card`/`.thumb`/`.body`/`.tags`/`.tag-chip` in `css/style.css`, markup in `index.html`
- Category: basic
- Description: full-card link, left image thumb + right text body with eyebrow/title/description/CTA/tag-chip row; only one instance currently exists
- Extractable props: `title`, `description`, `thumbSrc`, `href`, `tags` (string array)
- Hardcoded: layout proportions (1.1fr/1fr), hover lift/shadow, chip styling

## TagChip
- Source: `.tag-chip` in `css/style.css`
- Category: basic
- Description: small rounded pill label, green-tinted background, used inside project cards and the resume skills grid
- Extractable props: `label` (string)
- Hardcoded: colors, padding, radius, font-size

## PhotoColumn
- Source: `.photo-grid` in `css/style.css`, used in `index.html` About section
- Category: basic
- Description: vertical stack of uncropped photos (natural aspect ratio) beside prose text
- Extractable props: `images` (array of {src, alt})
- Hardcoded: gap, border, radius

Note: Basic UI primitives (Button, TagChip) are simple enough that design drafts can just inline the HTML/CSS directly rather than formally extracting `<sd-component>` entities — per the skill's own guidance to skip extraction for trivial primitives. Only NavBar/Footer are worth extracting if generating multiple pages, since their markup is duplicated verbatim in all 3 HTML files today.
