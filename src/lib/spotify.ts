// Server-side Spotify integration.
// Requires env vars:
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN  (obtained via scripts/spotify-auth.mjs)

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_URL = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENT_URL = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

export interface Track {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImage?: string;
  url: string;
  progress: number | null; // ms
  duration: number; // ms
}

async function getAccessToken(): Promise<string> {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) {
    throw new Error("Spotify env vars missing");
  }
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=refresh_token&refresh_token=${refresh}`,
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Token refresh failed: " + res.status);
  const data = await res.json();
  return data.access_token as string;
}

interface SpotifyTrackItem {
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
  duration_ms: number;
}

function mapTrack(item: SpotifyTrackItem, isPlaying: boolean, progress: number | null): Track {
  return {
    isPlaying,
    title: item.name,
    artist: item.artists.map((a) => a.name).join(", "),
    album: item.album.name,
    albumImage: item.album.images[0]?.url,
    url: item.external_urls.spotify,
    progress,
    duration: item.duration_ms,
  };
}

export async function getCurrentOrRecent(): Promise<Track | null> {
  if (!process.env.SPOTIFY_REFRESH_TOKEN) return null;

  try {
    const token = await getAccessToken();

    // Try currently playing first
    const nowRes = await fetch(NOW_PLAYING_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (nowRes.status === 200) {
      const data = await nowRes.json();
      if (data?.item) {
        return mapTrack(data.item, true, data.progress_ms ?? null);
      }
    }
    // 204 = nothing playing → fall through to recently played

    const recentRes = await fetch(RECENT_URL, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (recentRes.ok) {
      const data = await recentRes.json();
      const item = data?.items?.[0]?.track;
      if (item) return mapTrack(item, false, null);
    }

    return null;
  } catch (e) {
    console.error("Spotify fetch error:", e);
    return null;
  }
}
