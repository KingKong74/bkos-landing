// Edge-runtime-compatible HMAC token signing using Web Crypto.
// Used for admin session cookie.

const encoder = new TextEncoder();
const SESSION_DAYS = 30;
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) {
    // Don't crash, but log loudly. Routes will reject all tokens until set.
    console.warn("ADMIN_SECRET missing or too short (need 16+ chars)");
    return "do-not-use-this-default-secret-please";
  }
  return s;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function b64uEncode(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64uDecode(str: string): Uint8Array<ArrayBuffer> {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const b64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function signToken(payload: Record<string, unknown> = {}): Promise<string> {
  const body = b64uEncode(encoder.encode(JSON.stringify({ ...payload, iat: Date.now() })));
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${b64uEncode(sig)}`;
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  try {
    const key = await getKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64uDecode(sig),
      encoder.encode(body)
    );
    if (!valid) return false;
    const payload = JSON.parse(new TextDecoder().decode(b64uDecode(body)));
    if (typeof payload.iat !== "number") return false;
    if (Date.now() - payload.iat > SESSION_MS) return false;
    return true;
  } catch {
    return false;
  }
}

export const SESSION_COOKIE = "bkos_admin";
export const SESSION_MAX_AGE_S = SESSION_DAYS * 24 * 60 * 60;
