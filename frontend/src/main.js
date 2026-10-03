import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import reveal from './directives/reveal.js';
import { initTheme } from './composables/useTheme.js';
import './style.css';
// Warna aksen dari site.config.js (harus diimpor SETELAH style.css agar menang).
import './config/theme.generated.css';

// Apply theme before mount to avoid a flash of the wrong palette.
initTheme();

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.directive('reveal', reveal);
app.mount('#app');
