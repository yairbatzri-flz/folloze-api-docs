# Folloze API docs — embed bundle

Three drop-in files for embedding the documentation inside any web page:

| File | Purpose |
|---|---|
| `folloze-api-docs.html` | The HTML snippet (already wrapped in `<div class="flz-docs">…</div>`). Paste inline or fetch & inject. |
| `folloze-api-docs.css`  | Stylesheet. Every rule is scoped under `.flz-docs` so it won't bleed into your host page. |
| `folloze-api-docs.js`   | Self-contained IIFE — wires up the sidebar scroll-spy, code-tab switcher, and the `?` term-help popovers. |

## Three ways to embed

### Option 1 — Fetch & inject (recommended)

Most flexible; the snippet stays in a separate file you can update independently.

```html
<!-- Required fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

<!-- Stylesheet -->
<link rel="stylesheet" href="folloze-api-docs.css">

<!-- Mount point -->
<div id="folloze-docs-target"></div>

<script>
  fetch('folloze-api-docs.html')
    .then(r => r.text())
    .then(html => {
      document.getElementById('folloze-docs-target').innerHTML = html;
      const s = document.createElement('script');
      s.src = 'folloze-api-docs.js';
      s.defer = true;
      document.body.appendChild(s);
    });
</script>
```

See `embed-example.html` for a working demo.

### Option 2 — Inline paste

Paste the contents of `folloze-api-docs.html` (it's a `<div class="flz-docs">…</div>`) directly into your page, then load the CSS and JS:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="folloze-api-docs.css">

<!-- ... paste folloze-api-docs.html contents here ... -->

<script src="folloze-api-docs.js" defer></script>
```

### Option 3 — Iframe (zero-conflict fallback)

If your host page has aggressive CSS resets or framework styles you can't tame, use the standalone single-file build (`../index.html`) inside an iframe — guaranteed isolation:

```html
<iframe
  src="https://your.host/folloze-api-docs/index.html"
  style="width:100%; height:90vh; border:0;"
  title="Folloze API docs"
></iframe>
```

## Notes

- **Scoping.** All CSS rules in `folloze-api-docs.css` are prefixed with `.flz-docs` (or live on `:root` for design-token variables). They will not affect elements outside the embed root.
- **Sticky sidebar.** The sidebar uses `position: sticky`. If the embed sits inside a transformed/overflow-hidden container, the sticky positioning will flatten — wrap the embed in a plain block-level container or use the iframe option.
- **Fonts.** The bundle expects Open Sans + JetBrains Mono to be loaded. Easiest: include the Google Fonts link shown above. (Or self-host them.)
- **Popover root.** The term-help popover (`.term-popover`) is appended to `document.body` so it can escape any clipping ancestor. Its CSS lives inside `folloze-api-docs.css` and is also scoped via class selectors only — no conflicts.
- **External help-center links.** Open in a new tab via `target="_blank"`.
