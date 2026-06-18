#!/usr/bin/env node
/* eslint-disable */
// One-time Spotify OAuth helper.
//
// Usage:
//   SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-auth.mjs
//
// Setup required before running:
//   1. Go to https://developer.spotify.com/dashboard
//   2. Create app → name it (anything), redirect URI: http://127.0.0.1:8888/callback
//   3. Save → copy Client ID and Client Secret
//   4. Run this script with those values as env vars
//
// What this does:
//   - Opens your browser to Spotify's OAuth consent page
//   - Listens on http://127.0.0.1:8888/callback for the redirect
//   - Exchanges the auth code for a refresh token
//   - Prints the three env vars you need to paste into Dokploy
//
// The refresh token is permanent (until you revoke the app). Save it safely.

import http from "node:http";
import { exec } from "node:child_process";
import { randomBytes } from "node:crypto";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPE = "user-read-currently-playing user-read-recently-played";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("");
  console.error("Missing env vars. Run with:");
  console.error("  SPOTIFY_CLIENT_ID=xxx SPOTIFY_CLIENT_SECRET=yyy node scripts/spotify-auth.mjs");
  console.error("");
  console.error("If you don't have these yet:");
  console.error("  1. https://developer.spotify.com/dashboard → Create app");
  console.error("  2. Redirect URI: http://127.0.0.1:8888/callback");
  console.error("  3. Copy Client ID and Client Secret");
  console.error("");
  process.exit(1);
}

const state = randomBytes(8).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPE,
    redirect_uri: REDIRECT_URI,
    state,
  }).toString();

console.log("");
console.log("Opening browser to:");
console.log("  " + authUrl);
console.log("");
console.log("If browser doesn't open, paste that URL into one manually.");
console.log("");

const platform = process.platform;
const opener =
  platform === "darwin" ? "open" : platform === "win32" ? "start ''" : "xdg-open";
exec(`${opener} "${authUrl}"`);

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/callback")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const url = new URL(req.url, "http://127.0.0.1:8888");
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const errParam = url.searchParams.get("error");

  if (errParam) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h1>Spotify returned error: ${errParam}</h1>`);
    console.error("Spotify error:", errParam);
    process.exit(1);
  }

  if (returnedState !== state) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>State mismatch — abort</h1>");
    console.error("State mismatch");
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end("<h1>No code in callback</h1>");
    return;
  }

  try {
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });

    const data = await tokenRes.json();

    if (!tokenRes.ok || !data.refresh_token) {
      console.error("Token exchange failed:", data);
      res.writeHead(500, { "Content-Type": "text/html" });
      res.end(`<h1>Token exchange failed</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
      process.exit(1);
    }

    console.log("");
    console.log("=====================================================");
    console.log("✅ Success! Add these to your Dokploy env vars:");
    console.log("=====================================================");
    console.log("");
    console.log("SPOTIFY_CLIENT_ID=" + CLIENT_ID);
    console.log("SPOTIFY_CLIENT_SECRET=" + CLIENT_SECRET);
    console.log("SPOTIFY_REFRESH_TOKEN=" + data.refresh_token);
    console.log("");
    console.log("Then redeploy the app and the Spotify tile will start showing tracks.");
    console.log("");

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <html>
        <body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; background: #0f0e0c; color: #f4f4f1;">
          <h1 style="color: #f5a623;">✅ Success</h1>
          <p>Your refresh token has been printed to your terminal.</p>
          <p>Add the three env vars to Dokploy, redeploy, and you're done.</p>
          <p style="color: #7a7770; font-size: 14px;">You can close this tab.</p>
        </body>
      </html>
    `);

    setTimeout(() => process.exit(0), 1500);
  } catch (e) {
    console.error("Error:", e);
    res.writeHead(500, { "Content-Type": "text/html" });
    res.end("<h1>Error</h1><pre>" + (e instanceof Error ? e.message : String(e)) + "</pre>");
    process.exit(1);
  }
});

server.listen(8888, "127.0.0.1", () => {
  console.log("Waiting for Spotify redirect on http://127.0.0.1:8888/callback ...");
  console.log("(Ctrl+C to abort)");
});
