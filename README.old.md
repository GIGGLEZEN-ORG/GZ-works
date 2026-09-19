# GiggleZen Suites — Separated Component Project

This version separates every component into three easy-to-edit files:

```text
components/
  header/
    header.html   <- HTML structure/content
    header.js     <- loading/behavior only
    header.json   <- component data/reference

  hero/
    hero.html
    hero.js
    hero.json

  ...same structure for every component...
```

## Components

- header
- hero
- features
- architecture
- rooms
- sanctuary
- dining
- offers
- reviews
- location
- footer

## Main files

- `giggle.html` — main page
- `giggle.css` — custom styles
- `app.js` — shared loader/interactions

## Run

Because the component HTML files are loaded separately with `fetch()`, browsers block them when `giggle.html` is opened directly with `file://`.

Use **VS Code Live Server**:

1. Open this folder in VS Code.
2. Install the **Live Server** extension if needed.
3. Right-click `giggle.html`.
4. Choose **Open with Live Server**.

No Node.js, Vite, npm, `package.json`, or `node_modules` are required.

Tailwind is loaded from the CDN, so an internet connection is required for Tailwind and Google Fonts.

## Editing a component

For example, to change the header:

```text
components/header/header.html  -> change the HTML
components/header/header.css   -> optional component-specific CSS if added later
components/header/header.js    -> change behavior only
components/header/header.json  -> change data/reference values
```

The current project keeps the shared styling in `giggle.css` so the entire design remains easy to manage.
