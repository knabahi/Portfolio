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

## FULL JANK DIRECTION (explicit pivot — user said "go full GeoCities")

The user reviewed more reference sites and asked to go ALL IN on early-2000s amateur-web jank, explicitly saying this can override the "must look like a polished job-search portfolio" concern from earlier — jank IS the desired look now, not a light accent.

Concrete elements observed across the new references, all fair game to combine:
- **crosscountryroadtrip.com**: thick mismatched colored picture-frame borders around every photo/box (royal blue, orange, red) sitting on a peach/tan page background; a cartoon clip-art GIF-style icon (backpacker by a campfire); every content block has a DIFFERENT flat background color (black, brown, green) with no unified palette; a bright yellow highlight box with classic blue underlined hyperlink text; mixed bold red Arial-ish headings + serif body in places; deliberately inconsistent, scrapbook-like, not systematized.
- **mandow.ca**: a circular clip-art emblem/logo (dreamcatcher + antlers style illustration); photos with a soft oval-vignette faded-edge frame treatment (distinct from the hard rectangular frames above — use as an alternate photo treatment); small triangular "play-button" style bullet icons for list items; casual colored italic subheadings (green, teal); thin plain horizontal rule dividers; classic blue underlined links.
- **rupertriver.com**: (already fairly polished, less jank) a real photo banner with cursive script text overlaid, dark-brown top nav bar + dark-brown left sidebar with white text links — useful mainly as a MORE POLISHED anchor point if jank needs any grounding, but the direction now is to lean toward crosscountryroadtrip + mandow's chaos over this one's restraint.
- **amasci.com**: plain black-serif heading + dense blue-underlined-link list on white — mostly useful for "don't be afraid of a plain dense link list," not a strong visual signal otherwise.

**How to combine for the site**: thick mismatched colored borders around photo placeholders and boxed panels, at least one retro clip-art-style icon (SVG/icon substitute is fine since real GIFs aren't reproducible), a per-section clashing background color instead of one unified palette, classic underlined blue-link styling for at least some links (instead of the earlier serif-underline treatment), and a yellow highlight box treatment for at least one callout (e.g. the resume/contact CTA). Keep content/copy/section order identical regardless of how janky the visual treatment gets.

This FULL JANK direction should be generated as a separate branch draft alongside the existing polished "Framed Vintage Masthead" draft, not replacing it — the user wants to compare both.

## GROUND TRUTH extracted from real page source (not visual approximation)

Per user request, pulled actual HTML/CSS instead of just screenshots:

- **vegasclimb.com/chronological.htm**: has ZERO custom `font-family` anywhere in its `<style>` block. The serif look is purely the browser's default serif (Times New Roman on Windows/Chrome) rendered via legacy `<font size="6">` tags — not Georgia, not a webfont. "Use Kevin's font" = set the whole site to plain `Times New Roman, Times, serif` with no other font-family, exactly like this. Body text color `#5C5858`, page bg `#D7D7D7`, links `#000000` bold (not blue) with hover `#747170`.
- **crosscountryroadtrip.com**: literally built with Homestead SiteBuilder — absolute-positioned `<div>`s pixel-pinned to a fixed canvas, `<table>` cells with solid-color GIF rectangles for "boxes", and even a scrolling `<marquee>` tag (Verdana 28pt red, "Hostelling across North America"). **Do NOT copy this architecture** — it's non-responsive and marquee is obsolete/unsupported; it would actively break a modern site. DO reuse its real color palette as a jank-authentic swatch bank: peach bg `#ffcc99`, green block `#339966`, pink block `#FF99CC`, yellow block `#FFFF00`, black block `#000000`, red block `#FF0033`, cream block `#FFFFCC`, brown block `#996600`, light-green `#99FF99`, light-blue `#99C2FF`, blue `#0066FF`, dark-blue `#003C96`. Any of these are fair game for section backgrounds or border colors instead of invented ones.
- **routebaiejames.com**: real external stylesheet, Verdana 10pt body, ink `#3E433F`, sage-green highlight `#C4D89D`, link brown `#7B5B20` (not blue), secondary dusty-red box `#D09D9C`.

Use these real extracted values as hard constraints going forward instead of approximated colors/fonts.

## MARGIN TEXTURE (topographic contour lines)

The outer page-background margin (the peach/cream area around the framed layout) should carry a subtle background texture: light, sandy-tan topographic contour lines (like a USGS/hillshade map), NOT plain boring straight lines — irregular, organic contour-line shapes, at low contrast against the peach background (barely visible, decorative not distracting), with a few small elevation number labels (e.g. "2,340 ft", "1,180 ft") placed along some of the lines, in a tiny muted serif label. This should read as a tasteful nod to GIS/topo maps, sitting only in the margin space outside the main framed content box, not overlapping the boxed content itself. Implement as an inline SVG background pattern (contour-like wavy closed paths at varying low opacity) rather than an external image.

## Current baseline (for the pixel-perfect reproduction draft only)
See `.superdesign/init/theme.md` for the full current `css/style.css`. Summary: green `#2f6b3e` primary / `#e7f0e9` tint, off-white bg `#fbfaf6`, system sans-serif font stack only, 8-20px radii, one soft shadow on card hover, sticky blurred nav, solid-fill pill buttons and tag-chips.
