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
- `capacitor.config.json`, `package.json`, `scripts/`, `resources/`: native Android/iOS app
- `.github/workflows/android.yml`: builds the Android app on every push
- `privacy.html`: privacy policy (required by the app stores)

To add a project, append an entry to the `projects` array in `assets/script.js`.
Set `CONTACT_EMAIL` at the top of the same file so the contact form sends messages to your inbox.

## Android and iPhone apps (app stores)

The same site is packaged as a native app with [Capacitor](https://capacitorjs.com).
App ID: `io.github.komendenis.komen`, app name: **Komen**.

### Get a test APK (no setup)

Every push runs the **Android app** GitHub Action. Open the run under the repo's
*Actions* tab and download **komen-debug-apk**. Copy `app-debug.apk` to an Android
phone and open it to install (allow "install unknown apps" when asked).

### Publish on Google Play

1. Create a [Google Play Console](https://play.google.com/console) developer account (one-time US$25 fee).
2. Create an upload key once, on any computer with Java:
   ```bash
   keytool -genkeypair -v -keystore release.jks -alias komen -keyalg RSA -keysize 2048 -validity 10000
   base64 -w0 release.jks   # macOS: base64 -i release.jks
   ```
   Keep `release.jks` and its passwords safe. You need them for every update.
3. In GitHub → Settings → Secrets and variables → Actions, add:
   `ANDROID_KEYSTORE_BASE64` (the base64 output), `ANDROID_KEYSTORE_PASSWORD`,
   `ANDROID_KEY_ALIAS` (`komen`) and `ANDROID_KEY_PASSWORD`.
4. Re-run the workflow. It now also produces **komen-play-store-bundle** (`app-release.aab`).
5. In Play Console, create the app, upload the `.aab`, and fill in the store listing.
   Use `https://komendenis.github.io/komen/privacy.html` as the privacy policy URL.

### Publish on the Apple App Store

Apple builds need a Mac with Xcode and an [Apple Developer](https://developer.apple.com/programs/) account (US$99/year).

```bash
npm install
npx cap add ios
npm run assets -- --ios
npm run ios          # opens the project in Xcode
```

In Xcode, pick your team under *Signing & Capabilities*, then *Product → Archive* and upload to App Store Connect.

### Develop locally

```bash
npm install
npx cap add android   # first time only
npm run assets -- --android
npm run android       # copies the site into www/ and opens Android Studio
```

After changing the site, run `npm run sync` to copy it into the native apps.
