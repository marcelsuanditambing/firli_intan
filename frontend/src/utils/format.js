// Display formatters — bahasa mengikuti site.config.js (site.locale).
import { site } from '@/config';

const LOCALE = site.site.locale || 'id';
const MONTHS = {
  id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}[LOCALE];
const DAYS = {
  id: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}[LOCALE];
const DECIMAL = LOCALE === 'id' ? ',' : '.';
const TIME_SEP = LOCALE === 'id' ? '.' : ':';

export function formatDate(value, { withDay = true } = {}) {
  if (!value) return '';
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  return withDay ? `${DAYS[d.getDay()]}, ${base}` : base;
}

export function formatTime(value) {
  if (!value) return '';
  const [h, m] = String(value).split(':');
  if (h === undefined) return value;
  return `${h}${TIME_SEP}${m ?? '00'} ${site.site.timezone.label}`.trim();
}

export function formatWeight(grams) {
  if (!grams && grams !== 0) return '';
  const str = (grams / 1000)
    .toFixed(2) // dua desimal (3280 -> 3.28)
    .replace(/0+$/, '') // buang nol di belakang (3.20 -> 3.2)
    .replace(/\.$/, '') // buang titik jika tersisa (3.00 -> 3)
    .replace('.', DECIMAL);
  return `${str} kg`;
}

export function formatLength(cm) {
  if (!cm && cm !== 0) return '';
  const str = String(cm).replace(/\.0+$/, '').replace('.', DECIMAL); // 48.0 -> 48, 49.5 -> 49,5 / 49.5
  return `${str} cm`;
}
