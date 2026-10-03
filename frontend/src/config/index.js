// Satu pintu untuk konfigurasi situs. Isinya dibuat oleh scripts/generate.mjs
// dari site.config.js di root project — jangan edit site.generated.js manual.
import site from './site.generated.js';

export { site };
export const texts = site.texts;
export const sections = site.sections;
export default site;
