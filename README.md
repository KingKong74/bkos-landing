# bkos.dev — Bailey King

Resume-style personal site: Home, Resume, Projects and Contact tabs in one page, light/dark themes, live Brisbane weather and Spotify "now playing", plus a hidden admin panel. Next.js 16, self-hosted via Dokploy at `bkos.dev`.

## What's here

```
src/
├── app/
│   ├── page.tsx                 ← landing (server: weather + which /public files exist)
│   ├── landing.css              ← design tokens (light/dark) + all page styles
│   ├── work/page.tsx            ← redirects /work → /#resume
│   ├── admin/page.tsx           ← hidden dashboard (password-protected)
│   └── api/
│       ├── spotify/route.ts     ← current/recent track
│       └── admin/{login,logout,content,files}/route.ts
│   └── files/[slot]/route.ts    ← serves uploaded files
├── components/
│   ├── ResumeLanding.tsx        ← the whole public page (tabs via URL hash)
│   ├── AdminShell.tsx / AdminEditor.tsx / AdminLoginModal.tsx
├── lib/
│   ├── content.ts               ← content types + defaults
│   ├── contentStore.ts          ← reads/writes saved admin content (JSON on the volume)
│   ├── media.ts                 ← uploaded files (resume / headshot / hero)
│   ├── theme.ts, weather.ts, spotify.ts, auth.ts, build.ts
└── middleware.ts                ← protects /admin
```

## Editing content

Everything is editable at **/admin**: all page text (headings, buttons, labels, footer, Google title/description), profile, experience, CA modules, degrees, skills, projects, contacts, the home-page cards, show/hide switches for each home section, and the resume PDF / headshot / hero image uploads. Hit **Save** and it's live for everyone immediately (uploads apply instantly).

- Saved content: `$CONTENT_DIR/content.json`; uploads: `$CONTENT_DIR/uploads/`. In the container that's `/app/data`, a Docker volume (`bkoslanding-content`) mounted by Dokploy, so it survives redeploys.
- Defaults live in `src/lib/content.ts`, used until something is saved and after **Reset to defaults**.
- Uploaded files are served from `/files/<resume|avatar|hero>`. A file committed as `public/resume.pdf`, `public/avatar.jpg` or `public/hero.jpg` is used as a fallback when nothing is uploaded.
- **Download JSON** in the admin panel backs up the text content (not the uploads).

Project cards automatically load public webpage screenshots through Thum.io. The first capture can take a few seconds; a domain label remains visible if it fails. Set **Preview image URL (optional)** in the admin Projects tab to use your own screenshot (including a path under `public/`) instead. Private sites show their public login page unless you supply a screenshot.

## Hidden admin panel

**Trigger**: click within 64px of the top-right corner of the window 5 times within 2 seconds. A login modal appears.

**Auth**: password compared against the `ADMIN_PASSWORD` env var (set in Dokploy). On success a 30-day signed cookie is set and you land on `/admin`: status (deploy, Spotify, weather, analytics), which `public/` files exist, and the content editor.

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

**For the Spotify now-playing card (optional but recommended):**

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

Visit `https://bkos.dev` in your browser. The resume landing should load. Try the admin trick: 5 clicks in the top-right corner.

---

## Spotify setup (one-time)

The "Now playing" card requires a permanent refresh token, obtained via a one-time OAuth flow.

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

The Spotify now-playing card will start showing tracks within 30 seconds of you next playing music.

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
- **Spotify now-playing card shows "Connect refresh token"** — env vars not set or refresh token expired (re-run the auth script)
- **Profile pic doesn't show** — make sure `avatar.jpg` (literally that filename, lowercase) is in `public/`

---

## Tech choices, briefly

- **Next.js 16** App Router with `output: 'standalone'` for Docker
- **No UI or CSS framework**: one stylesheet of design tokens (`landing.css`), IBM Plex type
- **HMAC + Web Crypto** for admin auth (edge-runtime compatible)
- **Open-Meteo** for weather (no API key)
- **Cloudflare Web Analytics** for traffic (optional)
