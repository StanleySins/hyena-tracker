# Personal Development Tracker

Mobile-first, single-page web app with Supabase authentication and cloud persistence.

## Setup
1. Create a free Supabase project at https://supabase.com.
2. In its SQL editor, run `schema.sql`.
3. In `index.html`, replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` with your project's URL and publishable/anon key (never the service-role key).
4. Deploy the folder on Netlify, Cloudflare Pages, or another static host (or serve locally using `python -m http.server 8000`).
5. Open the app, sign up with email/password, and start tracking. Configure Supabase Auth's Site URL to match your deployed address.

No cloud credentials are bundled. Until configured, the app uses local browser storage in **Demo mode**, which is device-specific and not synced. The app explicitly labels that mode.

## Design and scoring
- Dates are interpreted in Europe/Sofia time.
- Daily habits: alcohol-free (40), smoke-free (10), Fitbit sleep score (0–15), planning Mon–Fri (20).
- Sleep: 75+ = 15, 65–74 = 10, 55–64 = 5, 45–54 = 2, under 45 = 0.
- Weekly habits: exercise 3x (20), yoga 1x (15), legs up wall 3x (5), personal development 3x (15), meditation 2x (10), church 1x (20), business meeting 1x (20), home drums 3x (10), studio drums 1x (20).
- Weekly extras beyond quota earn half points. Bonus activities earn points up to once daily by default, and weekly review once weekly.
- Weekly weighted adherence uses earned core-habit points up to quotas divided by available core-habit points for elapsed dates in the week, with weekly quotas assessed at week-end or shown as in-progress before then. Unreported days are excluded from observed adherence and shown as missing coverage; full-week compliance requires reports.
- November 23–30, 2026 is the trial; lifetime official points start December 1, 2026.
- A Perfect Day requires alcohol-free, smoke-free, sleep >=75, and planning on weekdays; all must be explicitly reported.
- The 21:00 reminder is a planned feature, **not enabled** in this version. Browser notifications need separate push infrastructure.
- Fitbit automatic sync is a future feature, not enabled.

## Privacy
Supabase row-level security isolates each user's records. Never insert the Supabase service-role key into client-side files.
