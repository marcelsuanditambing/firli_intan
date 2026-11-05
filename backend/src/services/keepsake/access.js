// =============================================================================
// Akses Buku Kenangan: cek PIN, batasi percobaan salah, dan token perangkat.
//
// - PIN hanya ada di server (.env -> KEEPSAKE_PIN), tidak pernah dikirim ke
//   browser. Dibandingkan secara constant-time.
// - Salah PIN 5x (per IP) -> IP itu dikunci 15 menit. Ada juga batas global
//   (30x salah dari semua IP dalam 15 menit) agar PIN tidak bisa ditebak terus
//   dengan berganti-ganti IP.
// - PIN benar -> token bertanda tangan (HMAC) berlaku 30 hari. Kunci tanda
//   tangan diturunkan dari PIN, jadi mengganti PIN otomatis membatalkan semua
//   token lama ("mengunci" semua perangkat).
// =============================================================================
import crypto from 'node:crypto';
import config from '../../config/index.js';

const MINUTE = 60 * 1000;
const GLOBAL_MAX_FAILS = 30;

const perIp = new Map(); // ip -> { fails, windowStart, lockedUntil }
let globalFails = []; // timestamp tiap PIN salah (semua IP)
let globalLockedUntil = 0;

const settings = () => config.keepsake;

export function isEnabled() {
  return settings().pin.length > 0;
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest();
}

function pinMatches(input) {
  const given = String(input ?? '').replace(/\s+/g, '');
  // Bandingkan hash (panjang selalu sama) -> waktu proses tidak membocorkan isi PIN.
  return crypto.timingSafeEqual(sha256(given), sha256(settings().pin));
}

function prune(now) {
  const windowMs = settings().lockMinutes * MINUTE;
  globalFails = globalFails.filter((ts) => now - ts < windowMs);
  if (perIp.size > 500) {
    for (const [ip, rec] of perIp) {
      if (rec.lockedUntil < now && now - rec.windowStart > windowMs) perIp.delete(ip);
    }
  }
}

// Sisa waktu kunci (detik) untuk IP ini, 0 bila tidak dikunci.
export function lockedFor(ip, now = Date.now()) {
  prune(now);
  const rec = perIp.get(ip);
  const until = Math.max(rec?.lockedUntil || 0, globalLockedUntil);
  return until > now ? Math.ceil((until - now) / 1000) : 0;
}

// Hasil: { ok: true } | { ok: false, attemptsLeft } | { ok: false, retryAfter }
export function checkPin(ip, pin, now = Date.now()) {
  const { maxAttempts, lockMinutes } = settings();
  const windowMs = lockMinutes * MINUTE;

  const wait = lockedFor(ip, now);
  if (wait) return { ok: false, retryAfter: wait };

  if (pinMatches(pin)) {
    perIp.delete(ip);
    return { ok: true };
  }

  let rec = perIp.get(ip);
  if (!rec || now - rec.windowStart > windowMs) rec = { fails: 0, windowStart: now, lockedUntil: 0 };
  rec.fails += 1;
  globalFails.push(now);

  if (globalFails.length >= GLOBAL_MAX_FAILS) {
    globalLockedUntil = now + windowMs;
    globalFails = [];
  }
  if (rec.fails >= maxAttempts) {
    rec.lockedUntil = now + windowMs;
    rec.fails = 0;
    rec.windowStart = now;
    perIp.set(ip, rec);
    return { ok: false, retryAfter: Math.ceil(windowMs / 1000) };
  }
  perIp.set(ip, rec);
  return { ok: false, attemptsLeft: maxAttempts - rec.fails };
}

// ---- Token perangkat -------------------------------------------------------
function signingKey() {
  return sha256(`keepsake|${settings().pin}|${config.app.ipHashSalt}`);
}

function sign(payload) {
  return crypto.createHmac('sha256', signingKey()).update(payload).digest('base64url');
}

export function issueToken(now = Date.now()) {
  const expiresAt = now + settings().tokenDays * 24 * 60 * MINUTE;
  const payload = `v1.${expiresAt}`;
  return { token: `${payload}.${sign(payload)}`, expiresAt: new Date(expiresAt).toISOString() };
}

export function verifyToken(token, now = Date.now()) {
  if (!isEnabled() || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1' || !/^\d{10,16}$/.test(parts[1])) return false;
  if (Number(parts[1]) <= now) return false;
  const expected = Buffer.from(sign(`v1.${parts[1]}`));
  const given = Buffer.from(parts[2]);
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

// Untuk pengujian.
export function _resetAccessState() {
  perIp.clear();
  globalFails = [];
  globalLockedUntil = 0;
}
