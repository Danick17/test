# Getting Bestmark on the App Store — Step-by-Step

The repo now ships two paths to athletes' phones. **Do path 1 first** — it requires no Apple account and no review, and path 2 depends on it.

## Path 1 — Installable web app (PWA) · works today, no store

The Next.js app in `web/` is now a Progressive Web App: manifest, icons, service worker with offline fallback, and iOS home-screen metadata.

1. Deploy `web/` to a public HTTPS host (see "Deploying" below).
2. On iPhone: open the site in Safari → Share → **Add to Home Screen**. On Android: Chrome shows an **Install app** prompt automatically.
3. The app opens full-screen with the Bestmark icon and dark theme, no browser chrome.

This is free, instant, and how many sports apps start. Ship this while preparing the store build.

## Path 2 — Native App Store app (Capacitor shell in `mobile/`)

The `mobile/` folder wraps the deployed site in a native iOS/Android shell. It cannot be built in this repo's environment — iOS builds require a Mac with Xcode.

### Prerequisites (things only you can provide)

| Requirement | Where | Cost |
|---|---|---|
| Deployed production site (HTTPS) | Fly.io / Railway / a VPS | ~$5–10/mo |
| Apple Developer Program account | developer.apple.com | $99/year |
| A Mac with Xcode installed | — | — |
| (Android) Google Play Console account | play.google.com/console | $25 once |

### Build steps (on your Mac)

```bash
cd mobile
# 1. Point the shell at your live site
#    Edit capacitor.config.ts → server.url = "https://your-domain.com"
npm install
npx cap add ios          # generates the Xcode project in mobile/ios/
npx cap sync
npx cap open ios         # opens Xcode
```

In Xcode:
1. Select the **App** target → Signing & Capabilities → choose your Apple Developer team.
2. Set the bundle identifier to `com.bestmark.app` (or your own reversed domain).
3. Add app icons: drag `web/public/icons/icon-512.png` derivatives into `Assets.xcassets/AppIcon` (Xcode 14+ accepts a single 1024×1024 — upscale the 512 or regenerate at 1024).
4. Product → Archive → **Distribute App** → App Store Connect → Upload.

Then in [App Store Connect](https://appstoreconnect.apple.com):
1. Create the app record (name: **Bestmark**, category: Health & Fitness).
2. Fill in screenshots (6.7" and 6.5" iPhone sizes), description, keywords, privacy policy URL, and the App Privacy questionnaire (Bestmark collects: name, handle, age, country, athletic performance data).
3. Add the build from the upload, optionally test via **TestFlight** first.
4. Submit for review. Reviews typically take 1–3 days.

### ⚠️ Apple's guideline 4.2 (minimum functionality)

Apple rejects apps that are "just a website in a wrapper." To pass review reliably, add at least one or two native touches before submitting:

- **Push notifications** (`@capacitor/push-notifications`) — "your rival just set a PR" is the natural Bestmark notification and a genuinely native capability.
- **Haptics on PR celebration** (`@capacitor/haptics`).
- **Share sheet** (`@capacitor/share`) for PR share cards.

The PWA path has no such gate — another reason to launch it first and submit the native build once one native feature is in.

### Android / Google Play (same shell)

```bash
npx cap add android && npx cap sync && npx cap open android
```
Build a signed AAB in Android Studio → upload in Play Console → review is usually < 1 day. Alternatively, a **TWA** (Trusted Web Activity, via Bubblewrap) can publish the PWA to Play directly with no Capacitor at all.

## Deploying the site (prerequisite for both paths)

The app uses SQLite, so pick a host with a persistent disk (not serverless):

- **Fly.io / Railway / Render**: `cd web && npm run build`, run with `npm start`; mount a volume at `web/data/`. Set `ANTHROPIC_API_KEY` to enable the full AI coach.
- Before opening sign-ups publicly, add rate limiting and consider email verification (noted in the product outline).
