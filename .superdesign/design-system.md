# Design System — Karim Nabahi Portfolio

## Product context
Personal portfolio site for a graduate geoinformatics student (GIS + conservation field background) who is actively job-hunting. Static, plain HTML/CSS, no framework, hosted on GitHub Pages. Home page (`index.html`) has: sticky nav, hero (title/tagline/CTA + a field-work photo), a Projects section (one SDSS case-study card), an About section (bio + a small column of field-work photos), a Contact section, footer. JTBD: read as a credible, hireable GIS professional while still feeling personal/human (field photos, first-person bio) rather than a generic corporate template.

## Visual direction: "Vintage Simple"
The user pointed at three reference sites: two genuinely old (mid-2000s) personal outdoor/travel sites (table layouts, Verdana, olive/gray palettes) and one modern travel site with photo carousels. Explicit feedback: don't literally recreate 2000s HTML (table layouts, `<font>` tags) — instead capture the *restraint*: simple typography, minimal chrome, no shadows/gradients, plain lists, a slightly aged/paper feel. This must still read as a credible, current job-search portfolio, not a nostalgia piece.

### Target tokens for this exploration
- **Background**: warm paper/parchment tones — cream/off-white (e.g. `#f7f2e7`–`#faf6ec` range), never stark white.
- **Ink**: warm near-black / dark brown for body text (e.g. `#2b2620`), not pure black.
- **Single accent color**: one muted, deep tone standing in for the current green — e.g. deep forest green (`#3a5a40`) or oxblood (`#7a3b2e`) — used sparingly (links, one rule, small labels), never as large color blocks.
- **Typography**: lean toward a plain serif for headings (Georgia/Times/serif system stack) paired with the existing sans for body copy, OR an all-serif treatment — no webfonts, no display/decorative fonts, no monospace unless used deliberately as a small accent (e.g. eyebrow labels, dates).
- **Borders over shadows**: replace card shadows/hover-lift with 1px hairline rules and generous whitespace. No gradients, no drop shadows, no rounded-pill chips — square or barely-rounded corners (0-4px) instead of the current 8-20px radii.
- **Chrome**: minimal — thin rule under nav instead of blur/translucency; buttons can be simple bordered rectangles or plain underlined text links instead of solid filled pills.
- **Labels/eyebrows**: small caps or letter-spaced uppercase, evoking old field-journal/map-legend labels.
- **Photos**: keep photos as the one "modern" trust signal — full-bleed-ish, simple thin border, no polish beyond that.

### What must NOT change (content/structure, from `pages.md` / `routes.md`)
- Same content and copy (hero tagline, About bio text, Projects card content, Contact links).
- Same section order: nav → hero → Projects → About → Contact → footer.
- Same responsive behavior expectations (usable on mobile, single breakpoint acceptable).
- Nav links: Projects, About, Resume, Contact. Hero has a photo. About has a photo column.

## CONVERGED DIRECTION (from real screenshots, not adjectives — use this over the exploratory tokens above)

After reviewing actual screenshots of the three reference sites (not just their raw HTML/CSS), the user picked specific, concrete elements to combine:

1. **Warm earthy palette** — tan/cream background, warm dark-brown ink text, oxblood/maroon as the primary accent (banner/wordmark), olive/sage green as a secondary accent (sidebar/nav highlighting). Concrete swatches to use: background `#f2ead9` (warm cream/tan), ink `#3b2f26` (warm dark brown, not black), primary accent `#6b3a2e` (oxblood/maroon), secondary accent `#7c8b5e` (muted olive/sage), border `#d8c9a8` (tan-brown hairline), card/box fill `#faf5e8` (lighter cream than page bg, for boxed panels).
2. **Layout: top bar + left sidebar** — like routebaiejames.com: a horizontal top bar (site title/wordmark), PLUS a vertical left sidebar containing the nav menu as a stacked list of links (not just inline top-nav links). Main content sits in bordered/tinted boxed panels (thin brown border, cream fill) rather than free-floating on the page background — this is the "box design" the user called out specifically.
3. **Typography: vegasclimb's serif, used throughout** — a single plain serif typeface (Georgia/Times-style system serif) for EVERYTHING — headings, nav, body, labels — not a serif/sans mix. This is what "the font from Kevin's website" and "I like the simplicity" both point to: one consistent, plain, old-fashioned serif voice site-wide, no webfonts.
4. **Simplicity stays non-negotiable**: no gradients, no drop shadows, no rounded pill buttons/chips — flat colors, hairline borders, plain text links (underlined) preferred over filled buttons where reasonable.

This converged direction supersedes the two earlier branch variations (Ledger and Field-Journal) — those were both guesses; this section reflects the user's actual picks after seeing real screenshots.

## REFINEMENT (from an annotated screenshot of routebaiejames.com)

The user marked up the reference site directly:
- **Outer page framing**: the whole site should sit inset with a modest blank-space margin around it (small gap at top, roughly quarter-to-half-inch on left/right), rather than the top bar/sidebar/content running flush to the true browser edges.
- **Header banner = photo-into-solid-color masthead**: replace a plain solid-color top bar with a two-part banner — one half a photo (fading/blending into the other half), the other half solid oxblood/maroon with the name overlaid on it, like a vintage travel-site masthead. Not just a flat color bar with text.
- **Top bar + left sidebar together = "the menu bars"**: confirmed to keep both, no change needed there.

## Current baseline (for the pixel-perfect reproduction draft only)
See `.superdesign/init/theme.md` for the full current `css/style.css`. Summary: green `#2f6b3e` primary / `#e7f0e9` tint, off-white bg `#fbfaf6`, system sans-serif font stack only, 8-20px radii, one soft shadow on card hover, sticky blurred nav, solid-fill pill buttons and tag-chips.
