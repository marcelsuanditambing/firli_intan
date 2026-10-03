// Satu pintu untuk konfigurasi situs. Isinya dibuat oleh scripts/generate.mjs
// dari site.config.js di root project — jangan edit site.generated.js manual.
import site from './site.generated.js';

export { site };
export const texts = site.texts;
export const sections = site.sections;
export const layout = site.layout || {};

// Teks dengan penanda angka, mis. t('wishesTotal', { n: 12 }).
export function t(key, vars = {}) {
  const s = texts[key] ?? '';
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

// Pisahkan "dr. Nama, Sp.OG, ..." menjadi nama + gelar (baris kedua).
export function splitCredentials(fullName = '') {
  const i = fullName.indexOf(', ');
  return i === -1 ? { name: fullName, credentials: '' } : { name: fullName.slice(0, i), credentials: fullName.slice(i + 2) };
}

// Paragraf dipisah baris kosong.
export function paragraphs(text = '') {
  return String(text || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

export default site;
