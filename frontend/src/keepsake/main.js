// Entry halaman Buku Kenangan (keepsake.html) — terpisah dari website utama:
// tanpa router, splash, musik, atau pencatatan pengunjung.
import { createApp } from 'vue';

// Huruf disertakan di build (sama dengan website: Cormorant Garamond, Jost, Parisienne).
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/jost/300.css';
import '@fontsource/jost/400.css';
import '@fontsource/jost/500.css';
import '@fontsource/parisienne/400.css';

import '../style.css';
import '../config/theme.generated.css'; // warna tema dari site.config.js
import './book.css';

import KeepsakeBook from './KeepsakeBook.vue';

document.documentElement.classList.remove('dark'); // buku selalu versi terang
createApp(KeepsakeBook).mount('#book');
