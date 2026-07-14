# Shared Layout Components

No component framework — these are raw HTML blocks repeated (with relative-path adjustments) at the top/bottom of every page: `index.html`, `resume.html`, `projects/adk-sdss.html`.

## Nav (appears on every page)

Source (as used in `index.html`; other pages use `resume.html`/`../index.html` style relative links):

```html
<nav class="nav">
  <div class="container">
    <div class="brand">Karim <span>Nabahi</span></div>
    <div class="links">
      <a href="#projects">Projects</a>
      <a href="#about">About</a>
      <a href="resume.html">Resume</a>
      <a href="#contact">Contact</a>
    </div>
  </div>
</nav>
```

CSS:
```css
.nav {
  position: sticky; top: 0; z-index: 500;
  background: rgba(251,250,246,0.92);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--border);
}
.nav .container { display: flex; align-items: center; justify-content: space-between; height: 62px; }
.nav .brand { font-weight: 700; font-size: 1.05rem; letter-spacing: .2px; }
.nav .brand span { color: var(--green); }
.nav .links a { margin-left: 22px; color: var(--muted); font-weight: 500; font-size: .95rem; }
.nav .links a:hover { color: var(--green); text-decoration: none; }
```

Description: sticky top bar, translucent/blurred background, wordmark left ("Karim" in ink + "Nabahi" in green), 4 nav links right-aligned with 22px gaps.

## Footer (home page variant)

```html
<footer>
  <div class="container">
    &copy; <span id="yr"></span> Karim Nabahi. Built with plain HTML, CSS, and Leaflet.
  </div>
</footer>
<script>document.getElementById('yr').textContent = new Date().getFullYear();</script>
```

## Footer (project page variant — adds back-link)

```html
<footer>
  <div class="container">
    <a href="../index.html">&larr; Back to projects</a> &nbsp;&middot;&nbsp;
    &copy; <span id="yr"></span> Karim Nabahi
  </div>
</footer>
```

CSS:
```css
footer { border-top: 1px solid var(--border); padding: 40px 0; color: var(--muted); font-size: .9rem; }
footer a { color: var(--muted); }
```

Description: simple single-line footer, muted text, top border, copyright + year (JS-populated) + tech credit or back-link.

## Page wrapper convention

Every page is `<!doctype html><html><head>...<link rel="stylesheet" href="css/style.css"></head><body> nav → header/hero → main sections → footer → year script </body></html>`. No JS framework, no client routing — plain multi-page HTML site. All content width is capped via `.container { max-width: 1060px; margin: 0 auto; padding: 0 24px; }`.
