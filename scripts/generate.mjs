#!/usr/bin/env node
// =============================================================================
// generate.mjs — ubah site.config.js menjadi file yang dipakai aplikasi.
//
//   node scripts/generate.mjs                       # pakai ./site.config.js
//   node scripts/generate.mjs --config path/to.js   # file config lain
//   node scripts/generate.mjs --check               # validasi saja, tanpa menulis
//
// Menghasilkan (semua AUTO-GENERATED, jangan diedit manual):
//   database/init/03-content.sql              seed + sinkronisasi konten DB
//   frontend/src/config/site.generated.js     teks, tema, bagian halaman
//   frontend/src/config/theme.generated.css   variabel warna aksen
//   frontend/public/favicon.svg               favicon dengan huruf monogram
//
// Tanpa dependensi — cukup Node.js 18+.
// =============================================================================
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  PALETTES,
  DEFAULT_SITE,
  DEFAULT_SECTIONS,
  DEFAULT_LOCATION,
  DEFAULT_SEO,
  DEFAULT_TEXTS,
  GENERIC_OG_SHA256,
} from './lib/defaults.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = resolve(ROOT, 'frontend/public');
const OUT = {
  sql: resolve(ROOT, 'database/init/03-content.sql'),
  siteJs: resolve(ROOT, 'frontend/src/config/site.generated.js'),
  themeCss: resolve(ROOT, 'frontend/src/config/theme.generated.css'),
  favicon: resolve(ROOT, 'frontend/public/favicon.svg'),
};

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const cfgIdx = args.indexOf('--config');
const configPath = resolve(ROOT, cfgIdx >= 0 ? args[cfgIdx + 1] : 'site.config.js');

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isPlainObject = (v) => v && typeof v === 'object' && !Array.isArray(v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const str = (v) => (blank(v) ? null : String(v).trim());

function isValidDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function normTime(s, where) {
  if (blank(s)) return null;
  const m = String(s).trim().match(/^(\d{1,2})[:.](\d{2})(?::(\d{2}))?$/);
  if (!m || +m[1] > 23 || +m[2] > 59) {
    err(`${where}: format jam harus "HH:MM" (24 jam), dapat "${s}"`);
    return null;
  }
  return `${m[1].padStart(2, '0')}:${m[2]}:${m[3] || '00'}`;
}

function hexToRgbTriplet(hex) {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

function sqlStr(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return Number.isFinite(v) ? String(v) : 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  return (
    "'" +
    String(v)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "''")
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r') +
    "'"
  );
}

function checkMaxLen(value, max, where) {
  if (value && value.length > max) err(`${where}: maksimal ${max} karakter (sekarang ${value.length})`);
}

// Validate a /public asset path. Returns the cleaned path (or null).
function asset(path, where, { kind = 'image', required = false } = {}) {
  const p = str(path);
  if (!p) {
    if (required) err(`${where}: wajib diisi`);
    return null;
  }
  if (/^https?:\/\//i.test(p)) return p; // external URL: trust it
  if (!p.startsWith('/')) {
    err(`${where}: path harus diawali "/" (relatif ke frontend/public), dapat "${p}"`);
    return null;
  }
  checkMaxLen(p, 255, where);
  const file = resolve(PUBLIC_DIR, `.${decodeURI(p)}`);
  if (!existsSync(file)) {
    warn(`${where}: file tidak ditemukan -> frontend/public${p}`);
  } else {
    const mb = statSync(file).size / 1024 / 1024;
    const limit = kind === 'audio' ? 8 : 1.5;
    if (mb > limit) {
      warn(`${where}: ukuran ${mb.toFixed(1)} MB (> ${limit} MB). Kompres dulu agar situs cepat dibuka di HP.`);
    }
  }
  return p;
}

// Replace {nama} / {anak} tokens.
function interpolate(text, vars) {
  if (typeof text !== 'string') return text;
  return text.replace(/\{(nama|anak|namaLengkap)\}/g, (_, k) => vars[k] ?? '');
}

// ---------------------------------------------------------------------------
// 1) Load config
// ---------------------------------------------------------------------------
if (!existsSync(configPath)) {
  console.error(`✖ File config tidak ditemukan: ${configPath}`);
  process.exit(1);
}
let raw;
try {
  raw = (await import(`${pathToFileURL(configPath).href}?t=${Date.now()}`)).default;
} catch (e) {
  console.error(`✖ Gagal membaca ${configPath}\n  ${e.message}\n  (cek koma, tanda kutip, dan kurung kurawal)`);
  process.exit(1);
}
if (!isPlainObject(raw)) {
  console.error('✖ site.config.js harus berisi `export default { ... }`');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2) Normalise + validate
// ---------------------------------------------------------------------------
const site = { ...DEFAULT_SITE, ...(raw.site || {}) };
site.timezone = { ...DEFAULT_SITE.timezone, ...(raw.site?.timezone || {}) };
site.slug = str(site.slug) || '';
site.url = (str(site.url) || '').replace(/\/+$/, '');

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(site.slug)) {
  err('site.slug: wajib, hanya huruf kecil/angka/tanda hubung (contoh: "aruna" atau "baby-aruna")');
}
checkMaxLen(site.slug, 120, 'site.slug');
if (site.url && !/^https?:\/\/[^\s/]+/i.test(site.url)) err('site.url: harus diawali http:// atau https://');
if (!site.url) warn('site.url kosong: canonical & preview link (og:url/og:image) belum absolut. Isi setelah domain siap.');
if (!/^[+-](0\d|1[0-4]):[0-5]\d$/.test(site.timezone.offset)) {
  err(`site.timezone.offset: format "+07:00", dapat "${site.timezone.offset}"`);
}

let palette;
if (typeof site.theme === 'string') {
  palette = PALETTES[site.theme];
  if (!palette) err(`site.theme: pilih salah satu ${Object.keys(PALETTES).join(' | ')} (dapat "${site.theme}")`);
} else if (isPlainObject(site.theme)) {
  palette = { ...PALETTES.gold, ...site.theme };
  for (const k of ['soft', 'base', 'deep', 'blush']) {
    if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(palette[k])) err(`site.theme.${k}: harus kode warna hex, mis. "#C9A86A"`);
  }
} else {
  err('site.theme: isi nama tema atau objek warna');
}
palette ||= PALETTES.gold;

// --- baby ---
const b = raw.baby || {};
const birth = b.birth || {};
const baby = {
  fullName: str(b.fullName),
  nickname: str(b.nickname),
  gender: str(b.gender) || 'female',
  description: str(b.description),
  profilePhoto: asset(b.profilePhoto, 'baby.profilePhoto'),
  nameMeaning: [],
  birth: {
    date: str(birth.date),
    time: normTime(birth.time, 'baby.birth.time'),
    weightGrams: blank(birth.weightGrams) ? null : Number(birth.weightGrams),
    lengthCm: blank(birth.lengthCm) ? null : Number(birth.lengthCm),
    place: str(birth.place),
    city: str(birth.city),
  },
};
if (!baby.fullName) err('baby.fullName: wajib diisi');
if (!baby.nickname) err('baby.nickname: wajib diisi');
checkMaxLen(baby.fullName, 100, 'baby.fullName');
if (!['female', 'male'].includes(baby.gender)) err('baby.gender: isi "female" atau "male"');
if (!isValidDate(baby.birth.date)) err('baby.birth.date: wajib, format "YYYY-MM-DD" (tanggal lahir atau HPL)');
if (baby.birth.weightGrams !== null) {
  if (!Number.isInteger(baby.birth.weightGrams) || baby.birth.weightGrams < 300 || baby.birth.weightGrams > 7000) {
    err(`baby.birth.weightGrams: isi dalam GRAM, bilangan bulat (mis. 3200), dapat "${birth.weightGrams}"`);
  }
}
if (baby.birth.lengthCm !== null && (!Number.isFinite(baby.birth.lengthCm) || baby.birth.lengthCm < 20 || baby.birth.lengthCm > 70)) {
  err(`baby.birth.lengthCm: isi dalam cm (mis. 49.5), dapat "${birth.lengthCm}"`);
}
checkMaxLen(baby.birth.place, 150, 'baby.birth.place');
checkMaxLen(baby.birth.city, 100, 'baby.birth.city');
if (Array.isArray(b.nameMeaning)) {
  b.nameMeaning.forEach((n, i) => {
    if (!str(n?.part) || !str(n?.meaning)) err(`baby.nameMeaning[${i}]: isi "part" dan "meaning"`);
    else baby.nameMeaning.push({ part: str(n.part), meaning: str(n.meaning) });
  });
}

const childWord = baby.gender === 'male' ? 'putra' : 'putri';
const vars = { nama: baby.nickname || '', anak: childWord, namaLengkap: baby.fullName || '' };
baby.description = interpolate(baby.description, vars);

// Born yet? (informational)
if (isValidDate(baby.birth.date)) {
  const t = baby.birth.time || '00:00:00';
  const ts = new Date(`${baby.birth.date}T${t}${site.timezone.offset}`).getTime();
  if (ts > Date.now()) {
    warn(`Tanggal lahir di masa depan -> situs tampil dalam MODE PENANTIAN (hitung mundur). Setelah lahir, isi jam/berat/panjang lalu generate ulang.`);
  }
}

// --- parents ---
const PARENT_ROLES = ['father', 'mother', 'guardian'];
const parents = (Array.isArray(raw.parents) ? raw.parents : []).map((p, i) => {
  const where = `parents[${i}]`;
  const row = {
    role: str(p?.role),
    fullName: str(p?.fullName),
    nickname: str(p?.nickname),
    photo: asset(p?.photo, `${where}.photo`),
  };
  if (!PARENT_ROLES.includes(row.role)) err(`${where}.role: isi ${PARENT_ROLES.join(' | ')}`);
  if (!row.fullName) err(`${where}.fullName: wajib diisi`);
  checkMaxLen(row.fullName, 100, `${where}.fullName`);
  checkMaxLen(row.nickname, 50, `${where}.nickname`);
  return row;
});
if (!parents.length) warn('parents kosong: bagian "Dengan cinta" & nama di footer tidak tampil.');

// --- doctors ---
const doctors = (Array.isArray(raw.doctors) ? raw.doctors : []).map((d, i) => {
  const where = `doctors[${i}]`;
  const row = {
    fullName: str(d?.fullName),
    subtitle: str(d?.subtitle),
    photo: asset(d?.photo, `${where}.photo`),
    bio: str(d?.bio),
  };
  if (!row.fullName) err(`${where}.fullName: wajib diisi`);
  checkMaxLen(row.fullName, 100, `${where}.fullName`);
  checkMaxLen(row.subtitle, 50, `${where}.subtitle`);
  return row;
});

// --- timeline ---
const timeline = (Array.isArray(raw.timeline) ? raw.timeline : []).map((t, i) => {
  const where = `timeline[${i}]`;
  const row = {
    title: str(t?.title),
    description: interpolate(str(t?.description), vars),
    date: str(t?.date),
    week: blank(t?.week) ? null : Number(t.week),
    image: asset(t?.image, `${where}.image`),
  };
  if (!row.title) err(`${where}.title: wajib diisi`);
  checkMaxLen(row.title, 150, `${where}.title`);
  if (row.date && !isValidDate(row.date)) err(`${where}.date: format "YYYY-MM-DD"`);
  if (row.week !== null && (!Number.isInteger(row.week) || row.week < 1 || row.week > 42)) {
    err(`${where}.week: minggu kehamilan 1–42`);
  }
  return row;
});

// --- gallery ---
const gallery = (Array.isArray(raw.gallery) ? raw.gallery : []).map((g, i) => {
  const where = `gallery[${i}]`;
  const row = {
    image: asset(g?.image, `${where}.image`, { required: true }),
    caption: interpolate(str(g?.caption), vars),
    featured: !!g?.featured,
  };
  checkMaxLen(row.caption, 255, `${where}.caption`);
  return row;
});

// --- music ---
let music = null;
if (raw.music) {
  music = {
    title: str(raw.music.title) || 'Lagu Latar',
    artist: str(raw.music.artist),
    file: asset(raw.music.file, 'music.file', { kind: 'audio', required: true }),
  };
}

// --- gifts ---
const GIFT_TYPES = ['bank_transfer', 'e_wallet', 'qris'];
const gifts = (Array.isArray(raw.gifts) ? raw.gifts : []).map((g, i) => {
  const where = `gifts[${i}]`;
  const row = {
    type: str(g?.type),
    provider: str(g?.provider),
    accountName: str(g?.accountName),
    accountNumber: str(g?.accountNumber),
    qrisImage: asset(g?.qrisImage, `${where}.qrisImage`),
    note: str(g?.note),
  };
  if (!GIFT_TYPES.includes(row.type)) err(`${where}.type: isi ${GIFT_TYPES.join(' | ')}`);
  if (!row.provider) err(`${where}.provider: wajib (mis. "BCA", "GoPay", "QRIS")`);
  if (row.type === 'qris' && !row.qrisImage) err(`${where}: tipe qris butuh qrisImage`);
  if (row.type !== 'qris' && !row.accountNumber) err(`${where}: accountNumber wajib untuk ${row.type}`);
  return row;
});

// --- sections / location / texts / seo ---
const sections = { ...DEFAULT_SECTIONS, ...(raw.sections || {}) };
for (const k of Object.keys(raw.sections || {})) {
  if (!(k in DEFAULT_SECTIONS)) warn(`sections.${k}: tidak dikenal (diabaikan). Pilihan: ${Object.keys(DEFAULT_SECTIONS).join(', ')}`);
}
if (sections.gift && !gifts.length) warn('sections.gift = true tetapi daftar gifts kosong.');

const location = { ...DEFAULT_LOCATION, ...(raw.location || {}) };
location.note = interpolate(str(location.note), vars) || '';
if (location.show === false) sections.location = false;
if (sections.location && !str(location.address)) {
  warn('location.address kosong -> bagian Lokasi hanya menampilkan dokter (jika ada).');
}

const texts = {};
for (const [k, v] of Object.entries({ ...DEFAULT_TEXTS, ...(raw.texts || {}) })) {
  texts[k] = interpolate(v, vars);
}
for (const k of Object.keys(raw.texts || {})) {
  if (!(k in DEFAULT_TEXTS)) warn(`texts.${k}: kunci tidak dikenal (salah ketik?). Lihat scripts/lib/defaults.mjs`);
}

const seoRaw = { ...DEFAULT_SEO, ...(raw.seo || {}) };
const seo = {
  title: interpolate(str(seoRaw.title), vars) || `${baby.fullName} · ${texts.seoTitleSuffix}`,
  description:
    interpolate(str(seoRaw.description), vars) ||
    baby.description ||
    `Dengan penuh syukur, kami umumkan kelahiran ${baby.fullName}.`,
  ogImage: asset(seoRaw.ogImage, 'seo.ogImage'),
};
if (seo.ogImage && seo.ogImage.startsWith('/')) {
  const f = resolve(PUBLIC_DIR, `.${seo.ogImage}`);
  if (existsSync(f) && createHash('sha256').update(readFileSync(f)).digest('hex') === GENERIC_OG_SHA256) {
    warn('seo.ogImage masih gambar generik template. Buat versi bernama bayi: python3 scripts/make-og-image.py');
  }
}

const monogram = (str(site.monogram) || baby.nickname || baby.fullName || '?').charAt(0).toUpperCase();

// ---------------------------------------------------------------------------
// 3) Report
// ---------------------------------------------------------------------------
if (warnings.length) {
  console.log('\n⚠  Peringatan:');
  warnings.forEach((w) => console.log(`   - ${w}`));
}
if (errors.length) {
  console.error('\n✖  Isian site.config.js belum valid:');
  errors.forEach((e) => console.error(`   - ${e}`));
  console.error('\nTidak ada file yang ditulis. Perbaiki lalu jalankan ulang.\n');
  process.exit(1);
}
if (checkOnly) {
  console.log(`\n✔  ${configPath} valid (mode --check, tidak ada file ditulis).\n`);
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 4) Write outputs
// ---------------------------------------------------------------------------
const stamp = `Dibuat otomatis oleh scripts/generate.mjs dari site.config.js — JANGAN diedit manual.`;

// 4a) SQL — idempotent: aman untuk init pertama DAN sinkronisasi ulang.
//      Ucapan (greetings) & statistik (visitor_logs) TIDAK disentuh.
const q = sqlStr;
const lines = [];
lines.push(`-- =============================================================================`);
lines.push(`-- ${stamp}`);
lines.push(`-- Konten situs "${site.slug}". Dijalankan otomatis saat MariaDB pertama kali`);
lines.push(`-- start, atau manual lewat ./scripts/sync-content.sh untuk memperbarui konten.`);
lines.push(`-- Aman diulang: data bayi di-upsert, konten dihapus lalu diisi ulang.`);
lines.push(`-- Tabel greetings (ucapan) & visitor_logs (statistik) tidak disentuh.`);
lines.push(`-- =============================================================================`);
lines.push(`SET NAMES utf8mb4;`);
lines.push(`START TRANSACTION;`, ``);

lines.push(`-- Bayi (upsert berdasarkan slug)`);
lines.push(
  `INSERT INTO babies (slug, name, birth_date, birth_time, weight_grams, length_cm, birth_place, birth_city, description)`
);
lines.push(
  `VALUES (${[
    site.slug,
    baby.fullName,
    baby.birth.date,
    baby.birth.time,
    baby.birth.weightGrams,
    baby.birth.lengthCm,
    baby.birth.place,
    baby.birth.city,
    baby.description,
  ]
    .map(q)
    .join(', ')})`
);
lines.push(
  `ON DUPLICATE KEY UPDATE name = VALUES(name), birth_date = VALUES(birth_date), birth_time = VALUES(birth_time),`
);
lines.push(
  `  weight_grams = VALUES(weight_grams), length_cm = VALUES(length_cm), birth_place = VALUES(birth_place),`
);
lines.push(`  birth_city = VALUES(birth_city), description = VALUES(description);`, ``);
lines.push(`SET @baby_id := (SELECT id FROM babies WHERE slug = ${q(site.slug)});`, ``);

function insertBlock(title, table, columns, rows) {
  lines.push(`-- ${title}`);
  lines.push(`DELETE FROM ${table} WHERE baby_id = @baby_id;`);
  if (rows.length) {
    lines.push(`INSERT INTO ${table} (baby_id, ${columns.join(', ')}) VALUES`);
    lines.push(rows.map((r) => `  (@baby_id, ${r.map(q).join(', ')})`).join(',\n') + ';');
  }
  lines.push('');
}

insertBlock(
  'Orang tua & dokter',
  'parents',
  ['role', 'full_name', 'nickname', 'photo_url', 'bio', 'sort_order'],
  [
    ...parents.map((p, i) => [p.role, p.fullName, p.nickname, p.photo, null, i + 1]),
    ...doctors.map((d, i) => ['doctor', d.fullName, d.subtitle, d.photo, d.bio, 100 + i]),
  ]
);
insertBlock(
  'Timeline kehamilan',
  'pregnancy_timeline',
  ['title', 'description', 'event_date', 'week_number', 'image_url', 'sort_order'],
  timeline.map((t, i) => [t.title, t.description, t.date, t.week, t.image, i + 1])
);
const anyFeatured = gallery.some((g) => g.featured);
insertBlock(
  'Galeri foto',
  'gallery_photos',
  ['image_url', 'caption', 'alt_text', 'sort_order', 'is_featured', 'is_published'],
  gallery.map((g, i) => [
    g.image,
    g.caption,
    (g.caption || `Foto ${baby.nickname}`).slice(0, 150),
    i + 1,
    anyFeatured ? g.featured : i === 0,
    true,
  ])
);
insertBlock(
  'Musik latar',
  'music_tracks',
  ['title', 'artist', 'file_url', 'is_active', 'sort_order'],
  music ? [[music.title, music.artist, music.file, true, 1]] : []
);
insertBlock(
  'Kado / QRIS',
  'gifts',
  ['type', 'provider_name', 'account_name', 'account_number', 'qris_image_url', 'note', 'sort_order', 'is_active'],
  gifts.map((g, i) => [g.type, g.provider, g.accountName, g.accountNumber, g.qrisImage, g.note, i + 1, true])
);
lines.push(`COMMIT;`, ``);

// 4b) Frontend config
const frontendConfig = {
  site: {
    slug: site.slug,
    url: site.url,
    monogram,
    timezone: site.timezone,
    footerCredit: str(site.footerCredit) || '',
  },
  baby: {
    fullName: baby.fullName,
    nickname: baby.nickname,
    gender: baby.gender,
    childWord,
    profilePhoto: baby.profilePhoto,
    nameMeaning: baby.nameMeaning,
  },
  location: {
    title: str(location.title) || DEFAULT_LOCATION.title,
    name: str(location.name) || '',
    address: str(location.address) || '',
    note: location.note,
  },
  sections,
  texts,
  seo,
};
const siteJs = `// ${stamp}\n// Edit site.config.js lalu jalankan: node scripts/generate.mjs\nexport default ${JSON.stringify(
  frontendConfig,
  null,
  2
)};\n`;

// 4c) Theme CSS (accent colours as RGB triplets for Tailwind alpha support)
const themeCss = `/* ${stamp} */
:root {
  --c-gold-soft: ${hexToRgbTriplet(palette.soft)};
  --c-gold: ${hexToRgbTriplet(palette.base)};
  --c-gold-deep: ${hexToRgbTriplet(palette.deep)};
  --c-blush: ${hexToRgbTriplet(palette.blush)};
}
`;

// 4d) Favicon
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="${palette.blush}"/>
  <circle cx="16" cy="16" r="12.5" fill="none" stroke="${palette.base}" stroke-width="0.8"/>
  <text x="16" y="21.5" font-family="Georgia, serif" font-size="16" font-weight="600" fill="${palette.deep}" text-anchor="middle">${monogram
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')}</text>
</svg>
`;

for (const p of Object.values(OUT)) mkdirSync(dirname(p), { recursive: true });
writeFileSync(OUT.sql, lines.join('\n'));
writeFileSync(OUT.siteJs, siteJs);
writeFileSync(OUT.themeCss, themeCss);
writeFileSync(OUT.favicon, favicon);

const rel = (p) => p.replace(`${ROOT}/`, '');
console.log(`\n✔  Konten "${baby.fullName}" (${site.slug}) berhasil dibuat:`);
Object.values(OUT).forEach((p) => console.log(`   - ${rel(p)}`));
console.log(
  `\n   ${parents.length} orang tua · ${doctors.length} dokter · ${timeline.length} timeline · ${gallery.length} foto · ` +
    `${music ? '1 lagu' : 'tanpa musik'} · ${gifts.length} kado`
);
console.log(`\nLangkah berikut:`);
console.log(`   • Pertama kali  : docker compose up -d --build`);
console.log(`   • Update konten : ./scripts/sync-content.sh   (situs sudah jalan)\n`);
