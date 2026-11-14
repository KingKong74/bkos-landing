# bkos.dev — Bailey's personal launchpad

A Next.js 16 personal site: bento landing page, photo gallery, trip stories, live Spotify "now playing", and a hidden admin panel. Designed to live at the apex of `bkos.dev` alongside `os.bkos.dev` (bailey.os).

## What's here

```
src/
├── app/
│   ├── page.tsx                  ← bento landing
│   ├── photos/page.tsx           ← masonry gallery + lightbox
│   ├── trips/page.tsx            ← trip index
│   ├── trips/[slug]/page.tsx     ← individual trip
│   ├── admin/page.tsx            ← hidden dashboard (password-protected)
│   └── api/
│       ├── spotify/route.ts      ← polls Spotify, returns current/recent track
│       ├── weather/route.ts      ← Brisbane temp via Open-Meteo
│       └── admin/{login,logout}/route.ts
├── components/                    ← Header, Avatar, AdminGate, SpotifyTile, Tiles, ...
├── lib/                           ← spotify, auth (HMAC), trips, photos, build time
└── middleware.ts                  ← protects /admin
content/                            ← (empty — content is in src/lib for now)
scripts/spotify-auth.mjs           ← one-time OAuth helper to get refresh token
public/                             ← drop avatar.jpg, photos, trip images here
```

---

## How content works

There's no CMS. You edit files and `git push`. Dokploy redeploys automatically.

### To add a photo
1. Drop the image into `public/photos/`
2. Add an entry to `src/lib/photos.ts`:
   ```ts
   { src: "/photos/my-photo.jpg", alt: "what it is", width: 800, height: 600, date: "2026-06-18" }
   ```
3. `git push` → live

### To add a trip
1. Create `public/trips/<slug>/` and drop the photos in
2. Add a `Trip` entry to `src/lib/trips.ts` with title, dates, location, story, photo paths
3. `git push` → live at `/trips/<slug>`

### To update the "Now" tile
Edit `NOW_TEXT` in `src/components/Tiles.tsx`, push.

### To add a profile pic
Drop `avatar.jpg` (square, ideally 400x400) into `public/`. Falls back to "BK" initials if missing.

---

## Hidden admin panel

**Trigger**: click within 64px of the top-right corner of the window 5 times within 2 seconds. A login modal appears.

**Auth**: password compared against `ADMIN_PASSWORD` env var. On success, a 30-day signed cookie is set, you're redirected to `/admin`.

The admin dashboard currently shows status only (Spotify connection, photo/trip counts, last deploy time, links to Cloudflare Web Analytics dashboard). It's read-only by design — actual content edits go through git.

---

## Deploying via Dokploy

Same pattern as bailey.os. Brief steps:

### 1. Push this folder to a new GitHub repo

```bash
cd bkos-landing
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KingKong74/bkos-landing.git
git push -u origin main
```

### 2. Create the Dokploy project

In Dokploy UI:
- Projects → **Create project** → name: `bkos-landing`
- Add Service → **Application**
- Source: GitHub → repo: `bkos-landing` → branch: `main`
- Build Type: **Dockerfile**
- Create, but **don't deploy yet** — env vars first

### 3. Set environment variables in Dokploy

**Required to make the app boot:**

```
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
ADMIN_PASSWORD=<pick a strong password>
ADMIN_SECRET=<random 32+ char string for signing session cookies>
```

Generate `ADMIN_SECRET` on the server:
```bash
openssl rand -hex 32
```

**For the Spotify tile (optional but recommended):**

```
SPOTIFY_CLIENT_ID=<from Spotify dashboard>
SPOTIFY_CLIENT_SECRET=<from Spotify dashboard>
SPOTIFY_REFRESH_TOKEN=<from running scripts/spotify-auth.mjs>
```

To get these — see the Spotify section below.

**For Cloudflare Web Analytics (optional):**

```
NEXT_PUBLIC_CF_ANALYTICS_TOKEN=<from CF dashboard>
```

Set it up later, doesn't block initial deploy.

### 4. Add the domain in Dokploy

In the bkos-landing service → **Domains** tab → Add:
- **Host**: `bkos.dev` (apex)
- **Path**: `/`
- **Container Port**: `3000`
- **HTTPS**: off (Cloudflare handles HTTPS at its edge)
- Save

### 5. Deploy

Click **Deploy** in Dokploy. First build takes ~3–5 min. Wait for Running status.

### 6. Add the Cloudflare tunnel route for the apex

In Cloudflare → Networks → Tunnels → `baileyos` → Routes → Add route:
- **Type**: Public hostname
- **Subdomain**: (leave empty for apex)
- **Domain**: `bkos.dev`
- **Path**: `/`
- **Service Type**: HTTP
- **URL**: `http://localhost:80`
- Save

Cloudflare auto-creates the DNS A/AAAA record for the apex.

### 7. Test

Visit `https://bkos.dev` in your browser. Bento landing should load. Try the 5-click admin trick on the profile pic.

---

## Spotify setup (one-time)

The "Now playing" tile requires a permanent refresh token, obtained via a one-time OAuth flow.

### 1. Create a Spotify Developer app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. **Create app** → name: `bkos-landing`, description: anything
3. **Redirect URIs**: add `http://127.0.0.1:8888/callback`
4. **Which APIs are you planning to use**: tick **Web API**
5. Save
6. Copy the **Client ID** and **Client Secret** from the app settings page

### 2. Run the auth script locally (on your Windows machine)

```bash
cd bkos-landing
SPOTIFY_CLIENT_ID=<paste-id> SPOTIFY_CLIENT_SECRET=<paste-secret> node scripts/spotify-auth.mjs
```

What happens:
- Browser opens to Spotify's authorize page
- You log in and click "Agree"
- Spotify redirects back to `http://127.0.0.1:8888/callback`
- The script exchanges the code for a refresh token
- Script prints the three env vars

### 3. Paste the three env vars into Dokploy

Find them in your terminal output after the script runs:
```
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
SPOTIFY_REFRESH_TOKEN=...
```

Add them to the bkos-landing Dokploy service env vars. Redeploy.

The Spotify tile will start showing tracks within 30 seconds of you next playing music.

---

## Cloudflare Web Analytics setup (optional)

1. dash.cloudflare.com → **Web Analytics** in the sidebar
2. **Add a site** → enter `bkos.dev` → next
3. Pick "I have a JavaScript snippet" → copy just the token (the part inside `data-cf-beacon`)
4. Add to Dokploy env vars: `NEXT_PUBLIC_CF_ANALYTICS_TOKEN=<that token>`
5. Redeploy
6. Stats appear in the CF dashboard within ~5 min of real traffic

---

## Common issues

- **Build fails on `npm install`** — confirm `.npmrc` is present in the repo with `legacy-peer-deps=true`
- **502 from Cloudflare** — bkos-landing service isn't running, or the domain isn't routing correctly in Dokploy
- **Admin page redirects to home immediately** — `ADMIN_SECRET` or `ADMIN_PASSWORD` env vars missing
- **Spotify tile shows "Connect refresh token"** — env vars not set or refresh token expired (re-run the auth script)
- **Profile pic doesn't show** — make sure `avatar.jpg` (literally that filename, lowercase) is in `public/`

---

## What's intentionally not here yet

Things we deferred to keep the first version shippable:
- **Real-time admin editing** — for now you `git push` to change content
- **Photo uploads via admin UI** — same
- **R2 / external photo storage** — photos live in the repo for now
- **CF Analytics API integration** — admin shows a placeholder + link to the CF dashboard

All easy to add later. The structure makes it straightforward.

---

## Tech choices, briefly

- **Next.js 16** App Router with `output: 'standalone'` for Docker
- **No UI library** — custom components, all dark with amber accent
- **HMAC + Web Crypto** for admin auth (edge-runtime compatible, no jose/jsonwebtoken)
- **react-markdown** for trip stories (only third-party UI dep)
- **Open-Meteo** for weather (no API key, free)
- **Cloudflare Web Analytics** for traffic (privacy-respecting, free, GDPR-friendly)
