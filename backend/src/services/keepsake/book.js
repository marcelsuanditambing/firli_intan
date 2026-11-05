// =============================================================================
// Buku Kenangan: kumpulkan data dari database, lalu cetak halaman buku
// (frontend: /keepsake.html) menjadi PDF A5 dengan Chromium.
//
// Isi tetap (teks, makna nama, tema, foto cerita) sudah ada di build frontend
// (site.config.js). Server hanya menyuntikkan data dinamis: profil bayi,
// orang tua & dokter, galeri, dan SEMUA ucapan yang sudah tampil.
// =============================================================================
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { Gallery, Wish } from '../../models/index.js';
import { resolveBaby } from '../baby.service.js';
import { toSnakeJson } from '../../utils/apiResponse.js';
import config from '../../config/index.js';
import logger from '../../utils/logger.js';
import ApiError from '../../utils/ApiError.js';

const CACHE_MS = 10 * 60 * 1000; // PDF yang sama dipakai ulang maks. 10 menit
const RENDER_TIMEOUT_MS = 45 * 1000;
const CHROMIUM_CANDIDATES = [
  '/usr/bin/chromium-browser', // Alpine (image Docker backend)
  '/usr/bin/chromium',
  '/usr/bin/google-chrome',
  '/opt/pw-browsers/chromium',
];

let cache = null; // { key, at, pdf }
let queue = Promise.resolve(); // render satu per satu (hemat RAM server)

export async function collectBookData(query = {}) {
  const baby = await resolveBaby(query, { withParents: true });
  const [gallery, wishes] = await Promise.all([
    Gallery.findAll({
      where: { babyId: baby.id, isPublished: true },
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    }),
    Wish.findAll({
      where: { babyId: baby.id, status: 'approved' },
      order: [['createdAt', 'ASC'], ['id', 'ASC']], // urut seperti buku tamu: yang pertama di depan
    }),
  ]);
  return toSnakeJson({ baby, gallery, wishes, generatedAt: new Date().toISOString() });
}

function cacheKey(data) {
  const last = data.wishes[data.wishes.length - 1];
  return [
    data.baby.id,
    data.baby.updated_at,
    data.wishes.length,
    last?.id,
    last?.updated_at,
    data.gallery.map((g) => `${g.id}:${g.updated_at}`).join(','),
    (data.baby.parents || []).map((p) => `${p.id}:${p.updated_at}`).join(','),
  ].join('|');
}

function chromiumPath() {
  const wanted = config.keepsake.chromiumPath;
  if (wanted) return wanted;
  const found = CHROMIUM_CANDIDATES.find((p) => existsSync(p));
  if (!found) throw new ApiError(503, 'Chromium tidak ditemukan di server (set CHROMIUM_PATH).');
  return found;
}

async function renderPdf(data) {
  const startedAt = Date.now();
  const browser = await puppeteer.launch({
    executablePath: chromiumPath(),
    headless: true,
    // Container produksi read-only: semua file sementara Chromium di /tmp.
    env: { ...process.env, HOME: '/tmp', XDG_CONFIG_HOME: '/tmp/.chromium', XDG_CACHE_HOME: '/tmp/.chromium' },
    args: [
      '--no-sandbox', // container tanpa user namespace
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-crash-reporter',
      '--disable-breakpad',
      '--font-render-hinting=none', // huruf PDF lebih rapi
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });
  try {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') pageErrors.push(msg.text());
    });

    await page.emulateMediaType('print'); // tata letak diukur persis seperti saat dicetak
    await page.evaluateOnNewDocument((payload) => {
      window.__KEEPSAKE__ = payload;
    }, data);

    const url = `${config.keepsake.renderUrl}/keepsake.html`;
    const res = await page.goto(url, { waitUntil: 'load', timeout: RENDER_TIMEOUT_MS });
    if (!res || !res.ok()) throw new Error(`Halaman buku tidak bisa dibuka (${res ? res.status() : 'no response'}): ${url}`);

    await page.waitForFunction('window.__KEEPSAKE_READY__ === true', { timeout: RENDER_TIMEOUT_MS });
    const bookError = await page.evaluate(() => window.__KEEPSAKE_ERROR__ || null);
    if (bookError) logger.warn(`keepsake: ${bookError}`);
    if (pageErrors.length) logger.warn(`keepsake page errors: ${pageErrors.slice(0, 3).join(' | ')}`);

    const pdf = await page.pdf({
      preferCSSPageSize: true, // ukuran A5 dari CSS @page
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      timeout: RENDER_TIMEOUT_MS,
    });
    logger.info(`keepsake: PDF ${(pdf.length / 1024 / 1024).toFixed(2)} MB, ${data.wishes.length} ucapan, ${Date.now() - startedAt} ms`);
    return Buffer.from(pdf);
  } finally {
    await browser.close().catch(() => {});
  }
}

// PDF terbaru (dari cache bila datanya belum berubah).
export async function getBookPdf(query = {}) {
  const data = await collectBookData(query);
  const key = cacheKey(data);
  if (cache && cache.key === key && Date.now() - cache.at < CACHE_MS) return cache.pdf;

  const job = queue.then(async () => {
    if (cache && cache.key === key && Date.now() - cache.at < CACHE_MS) return cache.pdf;
    const pdf = await renderPdf(data);
    cache = { key, at: Date.now(), pdf };
    return pdf;
  });
  queue = job.catch(() => {});
  return job;
}
