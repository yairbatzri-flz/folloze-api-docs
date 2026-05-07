# Folloze API — Documentation

Customer-facing documentation for the Folloze public APIs:

- **Board Creation API** (`https://integrations.folloze.com`) — programmatically generate Folloze boards from template boards.
- **Content API** (`https://content-api.folloze.com`) — manage content items and place them on boards with per-board overrides.

## Files

| File | Purpose |
|---|---|
| `index.html` | The narrative documentation (sidebar + sections, hand-written). |
| `openapi.json` | OpenAPI 3.0.3 spec covering every endpoint. Use to import into Postman/Insomnia or generate SDKs. |
| `swagger.html` | Swagger UI page that loads `openapi.json` — interactive endpoint explorer with "Try it out". |
| `redoc.html` | Redoc page that loads `openapi.json` — three-panel reference reader. |

## Viewing locally

The narrative docs are a single self-contained HTML file with no build step:

```bash
open index.html
```

The Swagger / Redoc viewers fetch `openapi.json` over the network, so serve the
folder over HTTP rather than opening it as `file://`:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000           (narrative docs)
#       or  http://localhost:8000/swagger.html
#       or  http://localhost:8000/redoc.html
```

## GitHub Pages

The site is published via GitHub Pages from the repo root. After enabling Pages
(Settings → Pages → Source: `main` / `/ (root)`), the docs are available at:

```
https://<owner>.github.io/<repo>/
```

## Editing

All content, styles, and scripts live in `index.html`. Sections of interest:

- `<style>` block near the top — design tokens (`:root`), layout, components.
- Sidebar `<nav>` — table of contents.
- `<main>` — the actual documentation content, organized by `<h2 id="…">` anchors.
- Bottom `<script>` — sidebar scroll-spy and the tabbed code-example switcher.

## Stack

Plain HTML + CSS + a few lines of vanilla JS. No framework, no build, no
dependencies — intentionally easy to host anywhere.
