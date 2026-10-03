import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import site from './src/config/site.generated.js';

const esc = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Menyuntikkan <title>, meta SEO & Open Graph dari site.config.js ke index.html
// saat dev maupun build, sehingga preview link WhatsApp/IG langsung benar.
function siteHead() {
  return {
    name: 'site-head',
    transformIndexHtml(html) {
      const { seo, baby, site: s } = site;
      const abs = (p) => (p && s.url && p.startsWith('/') ? `${s.url}${p}` : p || '');
      const tags = [
        `<title>${esc(seo.title)}</title>`,
        `<meta name="description" content="${esc(seo.description)}" />`,
        `<meta name="author" content="Keluarga ${esc(baby.nickname)}" />`,
        s.url ? `<link rel="canonical" href="${esc(s.url)}/" />` : '',
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(baby.nickname)}" />`,
        `<meta property="og:title" content="${esc(seo.title)}" />`,
        `<meta property="og:description" content="${esc(seo.description)}" />`,
        s.url ? `<meta property="og:url" content="${esc(s.url)}/" />` : '',
        seo.ogImage ? `<meta property="og:image" content="${esc(abs(seo.ogImage))}" />` : '',
        seo.ogImage ? `<meta property="og:image:width" content="1200" />` : '',
        seo.ogImage ? `<meta property="og:image:height" content="630" />` : '',
        `<meta property="og:locale" content="id_ID" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${esc(seo.title)}" />`,
        `<meta name="twitter:description" content="${esc(seo.description)}" />`,
        seo.ogImage ? `<meta name="twitter:image" content="${esc(abs(seo.ogImage))}" />` : '',
        seo.ogImage ? `<link rel="apple-touch-icon" href="${esc(seo.ogImage)}" />` : '',
      ].filter(Boolean);
      return html.replace('<!-- site:head -->', tags.join('\n    '));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), siteHead()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    // Proxy /api to the backend during local development.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
