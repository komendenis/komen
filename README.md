# komen

Personal data science portfolio site that shows my machine learning projects: regression, classification, NLP and synthetic data generation.

## Run locally

It's a static site with no build step. Open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
```

## Publish with GitHub Pages

Settings → Pages → Deploy from branch → `main` / root.

## Structure

- `index.html`: page markup
- `assets/styles.css`: styles, light/dark theme, responsive layout
- `assets/script.js`: project data, filters, theme toggle, contact form

To add a project, append an entry to the `projects` array in `assets/script.js`.
Set `CONTACT_EMAIL` at the top of the same file so the contact form sends messages to your inbox.
