# Frontend

Vue 3 (Composition API) + Vite + Vue Router + Pinia + Tailwind + Axios.
Mobile-first, tampilan premium krem/putih + warna aksen tema. Seluruh halaman
adalah satu kolom selebar HP di tengah latar yang hangat.

## Konfigurasi dari `site.config.js`

Semua konten non-database dibaca dari `src/config/` — **hasil generate, jangan
diedit manual**:

| File | Dipakai oleh |
|---|---|
| `src/config/site.generated.js` | teks (`texts`), bagian aktif (`sections`), foto profil & makna nama, lokasi, zona waktu, SEO |
| `src/config/theme.generated.css` | variabel warna aksen `--c-gold*`, `--c-blush` |
| `src/config/index.js` | pintu masuk: `import { site, texts, sections } from '@/config'` |

`vite.config.js` juga membaca config ini untuk menyuntikkan `<title>`, meta
description, dan tag Open Graph/Twitter ke `index.html` (placeholder
`<!-- site:head -->`).

## Design tokens (tailwind.config.js)
- Warna netral: `cream`, `ivory`, `sand`, `shell`, `ink{DEFAULT,soft,muted,faint}` — berbalik otomatis di dark mode.
- Warna aksen: `gold{soft,DEFAULT,deep}`, `blush` — nilainya dari tema (nama kelas `gold` dipertahankan dari Filo). `rose` = warna error.
- Font: `font-display` (Cormorant Garamond), `font-sans` (Jost), `font-script` (Parisienne).
- Elemen khas: huruf monogram dalam cincin tipis (`ui/Monogram.vue`), dipakai di splash, footer, halaman ucapan & 404.

## Struktur
```
src/
├── config/        site.generated.js, theme.generated.css (hasil generate) + index.js
├── components/
│   ├── layout/    SplashScreen, FloatingDock (BackToTop, ThemeToggle, MusicToggle), AppFooter
│   ├── sections/  Hero, BabyProfile, BirthInfo, AgeCounter, Story, Timeline, Gallery,
│   │              Gift, Location (+ dokter), Doctor, Stats, Wishes, ShareBar
│   └── ui/        Monogram, SectionHeading, SectionDivider, BaseButton, SkeletonLine, SkeletonCard, ErrorState
├── composables/   useBabyAge, useBackgroundMusic, useCountUp, useScrollTo, useSeo, useSession, useTheme
├── directives/    reveal.js  (v-reveal: animasi saat di-scroll)
├── services/      http.js (Axios + ?baby=<slug> otomatis), api.js (peta endpoint)
├── stores/        baby, gallery, timeline, music, gifts, wishes, stats, ui  (Pinia)
├── utils/         format.js (tanggal/jam/berat/panjang, locale id)
├── views/         HomeView (menyusun section sesuai `sections`), WishesView (/ucapan), NotFoundView
├── App.vue        shell: splash + kolom tengah + floating dock
├── main.js        registrasi Pinia, Router, v-reveal, CSS tema
└── style.css      layer Tailwind + reveal/skeleton/reduced-motion
```

## Perilaku
- Splash sampai tombol "Lihat Selengkapnya" ditekan; gesture itu juga memutar
  musik (aman dari blokir autoplay) dan mencatat kunjungan (`POST /api/visitor`).
- Mode penantian otomatis: selama tanggal lahir (+ jam, zona waktu dari config)
  masih di masa depan, hero/detail/penghitung berganti ke teks "menantikan" dan
  hitung mundur.
- Tiap section punya tiga state: skeleton saat memuat, `ErrorState` dengan tombol
  coba lagi, dan pesan kosong.
- Form ucapan menampilkan error per kolom; bila backend auto-approve, ucapan
  baru langsung muncul di atas daftar.
- Dark mode via CSS variables (tersimpan per situs, mengikuti sistem).

## Menambah section baru
1. Buat komponen di `components/sections/`.
2. Tambahkan flag di `DEFAULT_SECTIONS` (`scripts/lib/defaults.mjs`) dan teksnya di `DEFAULT_TEXTS`.
3. Pasang di `views/HomeView.vue` dengan `v-if="s.namaFlag"`.
4. Jalankan `node scripts/generate.mjs`.

## Run
```bash
node scripts/generate.mjs   # dari root project
cd frontend
npm install
npm run dev                 # http://localhost:5173 (proxy /api ke :3000)
npm run build               # build produksi -> dist/
```
