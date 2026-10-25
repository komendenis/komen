# komen

Personal data science portfolio site that shows my machine learning projects: regression, classification, NLP and synthetic data generation.

## Run locally

It's a static site with no build step. Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

## Publish with GitHub Pages

Settings → Pages → Deploy from branch → `main` / root.

## Install as an app

The site is a Progressive Web App: it has a web manifest, app icons and an
offline service worker. Once it's served over HTTPS (for example GitHub Pages):

- **Android / Chrome / Edge:** tap the **Install app** button in the header, or
  use the browser menu → *Install app*.
- **iPhone / iPad (Safari):** Share → *Add to Home Screen*.

The installed app opens in its own window and works offline.
When you change the files, bump `CACHE` in `sw.js` so users get the update.

## Structure

- `index.html`: page markup
- `assets/styles.css`: styles, light/dark theme, responsive layout
- `assets/script.js`: project data, filters, theme toggle, contact form, install button
- `manifest.webmanifest`, `sw.js`, `assets/icons/`: app install and offline support

To add a project, append an entry to the `projects` array in `assets/script.js`.
Set `CONTACT_EMAIL` at the top of the same file so the contact form sends messages to your inbox.
