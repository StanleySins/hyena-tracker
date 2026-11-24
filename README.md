# Hyena Tracker

A static habit tracker with browser storage and optional synchronization through personal OneDrive. It runs on GitHub Pages and uses MSAL Browser with authorization code and PKCE.

## Microsoft Entra setup

1. In App registrations, open **Hyena Tracker**. The registration must accept personal Microsoft accounts. Its public **Application (client) ID** is configured in `index.html`.
2. Open **Authentication (Preview)**, select **Add Redirect URI**, choose the **Single-page application** platform, and save `https://stanleysins.github.io/hyena-tracker/` with the trailing slash. Leave implicit access and ID tokens unchecked. The SPA uses no client secret.
3. Under **API permissions**, verify that **Microsoft Graph** lists **Files.ReadWrite.AppFolder** as a delegated permission. Use a personal Microsoft account with OneDrive set up.
4. For local sign-in testing, register `http://localhost:8000/` as a separate SPA redirect URI and start a local server with `python -m http.server 8000` from the repository root.

[Microsoft Entra redirect URI setup](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri) · [OneDrive app folder documentation](https://learn.microsoft.com/graph/onedrive-sharepoint-appfolder)

## GitHub Pages and verification

Publish the repository root from `main` under **Settings → Pages → Deploy from a branch**. Once the Pages deployment succeeds, open the site and choose **Connect OneDrive**.

If OneDrive is empty, the tracker offers to copy existing browser data into it. If a cloud copy already exists, the app opens that copy. Signed-out data stays available in the original browser after signing out. Signed-in edits are cached separately per account. Use **Sync now** to retry a failed request or fetch recent changes. If OneDrive changed while this device had pending edits, export those edits under **Habits & Settings** before choosing whether to load the cloud copy. The tracker does not automatically merge conflicting copies.

To verify end-to-end sync, save a test habit entry and wait for **OneDrive synced**. Open the site in a second browser profile or on another device, connect the same Microsoft account, and confirm the entry appears. Undo the test entry and confirm the change reaches both devices. The tracker stores `hyena-tracker.json` in its OneDrive app folder. Keep habit backups separate from the public repository.

## Design and scoring
- Dates are interpreted in Europe/Sofia time.
- Daily habits: alcohol-free (40), smoke-free (10), Fitbit sleep score (0–15), planning Mon–Fri (20).
- Sleep: 75+ = 15, 65–74 = 10, 55–64 = 5, 45–54 = 2, under 45 = 0.
- Weekly habits: exercise 3x (20), yoga 1x (15), legs up wall 3x (5), personal development 3x (15), meditation 2x (10), church 1x (20), business meeting 1x (20), home drums 3x (10), studio drums 1x (20), sauna 1x (15) starting November 24, 2026.
- Weekly extras beyond quota earn half points. Bonus activities earn points up to once daily by default, and weekly review once weekly.
- Weekly weighted adherence uses earned core-habit points up to quotas divided by available core-habit points for elapsed dates in the week, with weekly quotas assessed at week-end or shown as in-progress before then. Unreported days are excluded from observed adherence and shown as missing coverage; full-week compliance requires reports.
- November 23–30, 2026 is the trial; lifetime official points start December 1, 2026.
- A Perfect Day requires alcohol-free, smoke-free, sleep >=75, and planning on weekdays; all must be explicitly reported.
- The 21:00 reminder is a planned feature, **not enabled** in this version. Browser notifications need separate push infrastructure.
- Fitbit automatic sync is a future feature, not enabled.
