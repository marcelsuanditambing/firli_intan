// =============================================================================
// Nilai bawaan untuk site.config.js. Semua yang tidak diisi di site.config.js
// akan memakai nilai di sini.
//
// Teks boleh memakai penanda {nama} (panggilan), {namaLengkap}, {anak}
// ("putri"/"putra" atau "little girl"/"little boy"). Penanda {n} / {i} diisi
// oleh halaman (angka).
//
// Setiap teks juga boleh berbentuk { expecting: '...', born: '...' } — generator
// memilih sesuai baby.status (mode penantian vs sudah lahir).
// =============================================================================

// ---------------------------------------------------------------------------
// Tema. Minimal berisi warna aksen { soft, base, deep, blush }.
// Opsional:
//   dark     : aksen pengganti di mode gelap
//   neutrals : { light: {...}, dark: {...} } warna latar & teks (tema Filo
//              memakai krem; tema navy memakai putih & navy)
//   button   : { light: { from, to, text }, dark: { from, to, text } }
// Isi site.theme di site.config.js dengan nama tema, atau objek dengan
// struktur yang sama untuk warna kustom.
// ---------------------------------------------------------------------------
export const NEUTRALS_WARM = {
  light: {
    cream: '#FBF8F1', ivory: '#FEFCF8', sand: '#F3ECDF', shell: '#EFE7D8',
    ink: '#4A4038', inkSoft: '#6E6358', inkMuted: '#8A7E72', inkFaint: '#B3A899',
    skeletonA: '#EFE7D8', skeletonB: '#F7F1E7',
  },
  dark: {
    cream: '#1E1A16', ivory: '#27221B', sand: '#15120E', shell: '#3A332B',
    ink: '#E9E1D4', inkSoft: '#F3ECDF', inkMuted: '#B3A795', inkFaint: '#837866',
    skeletonA: '#2C2620', skeletonB: '#383029',
  },
};

export const PALETTES = {
  gold: { soft: '#E0C896', base: '#C9A86A', deep: '#B08D4F', blush: '#E7D3CE' }, // krem-emas (asli Filo)
  rose: { soft: '#EDC7CC', base: '#D69CA5', deep: '#B5707C', blush: '#F3DDE0' }, // merah muda lembut
  sage: { soft: '#CBD8C1', base: '#9FB38F', deep: '#6E8A5C', blush: '#E4EADB' }, // hijau sage
  sky: { soft: '#C3D8E8', base: '#8DB2CF', deep: '#5A84A6', blush: '#DCE8F1' }, // biru langit
  lavender: { soft: '#DCCFE8', base: '#B59ECC', deep: '#8A6CA8', blush: '#ECE3F2' }, // ungu lavender
  // Navy · silver · putih: navy untuk teks & aksen, perak untuk garis/ornamen.
  navy: {
    soft: '#CDD3DC', base: '#A3ACBA', deep: '#24365E', blush: '#DCE3EE',
    dark: { soft: '#5B6884', base: '#A3ACBA', deep: '#C3CAD5', blush: '#22314F' },
    neutrals: {
      light: {
        cream: '#F5F7FA', ivory: '#FFFFFF', sand: '#E6EBF2', shell: '#DDE3EB',
        ink: '#34405A', inkSoft: '#1B2A4A', inkMuted: '#66708A', inkFaint: '#8E97A8',
        skeletonA: '#E6EBF2', skeletonB: '#F3F5F9',
      },
      dark: {
        cream: '#0E1626', ivory: '#16213A', sand: '#0A101D', shell: '#2A3654',
        ink: '#D3D9E3', inkSoft: '#E6EAF0', inkMuted: '#A9B2C2', inkFaint: '#7C879C',
        skeletonA: '#16213A', skeletonB: '#22304F',
      },
    },
    button: {
      light: { from: '#34497A', to: '#1B2A4A', text: '#FFFFFF' },
      dark: { from: '#D5DAE2', to: '#A3ACBA', text: '#1B2A4A' },
    },
  },
};

export const LOCALES = ['id', 'en'];

export const DEFAULT_SITE = {
  slug: '',
  url: '',
  locale: 'id', // 'id' | 'en'
  theme: 'gold',
  monogram: null,
  timezone: { offset: '+07:00', label: 'WIB' },
  footerCredit: '',
};

export const DEFAULT_SECTIONS = {
  profile: true, // foto profil + nama + deskripsi (+ makna nama bila nameStory false)
  nameStory: false, // makna nama sebagai bagian tersendiri
  birthInfo: true,
  ageCounter: true,
  story: true,
  timeline: true,
  gallery: true,
  location: true,
  doctors: true,
  stats: true,
  wishes: true,
  gift: false,
  share: false,
};

// Variasi tata letak (semua opsional).
export const DEFAULT_LAYOUT = {
  splashTextFirst: false, // true = kalimat pembuka di atas nama
  splashName: 'full', // 'full' (nama lengkap) | 'nickname' (huruf kapital)
  heroPhoto: false, // true = foto profil bulat di bagian pembuka
  storyPhoto: null, // path satu foto orang tua berdua (null = foto masing-masing)
  footerName: 'full', // 'full' | 'nickname'
  galleryAspect: '4/3', // bingkai galeri: '4/3' (landscape) | '4/5' / '3/4' (portrait) | '1/1'
  // Urutan bagian di bawah pembuka (hero selalu pertama, footer selalu terakhir).
  // Bagian yang dimatikan di `sections` otomatis dilewati.
  order: ['profile', 'nameStory', 'birthInfo', 'ageCounter', 'story', 'timeline', 'gallery', 'gift', 'location', 'doctors', 'stats', 'wishes', 'share'],
};

export const DEFAULT_LOCATION = {
  show: true,
  title: { id: 'Kediaman Kami', en: 'Our Home' },
  name: '',
  address: '',
  note: '',
};

export const DEFAULT_SEO = {
  title: null,
  description: null,
  ogImage: '/og-image.png',
};

export const CHILD_WORD = {
  id: { female: 'putri', male: 'putra' },
  en: { female: 'little girl', male: 'little boy' },
};

// ---------------------------------------------------------------------------
// Teks bawaan per bahasa. Kunci yang sama untuk semua bahasa.
// ---------------------------------------------------------------------------
export const DEFAULT_TEXTS_BY_LOCALE = {
  id: {
    // Layar pembuka
    splashEyebrow: 'Pengumuman Kelahiran',
    splashIntro:
      'Dengan penuh kasih, kami ingin berbagi kabar bahagia dan memperkenalkan {anak} kecil kami kepada keluarga, sahabat dan orang-orang terkasih.',
    splashButton: 'Lihat Selengkapnya',

    // Pembuka (hero)
    heroScript: 'dengan penuh syukur',
    heroEyebrowBorn: 'Telah lahir {anak} kami',
    heroEyebrowWaiting: 'Menantikan kelahiran {anak} kami',
    heroTagline: '',
    heroDatePrefix: '',
    heroClosing: '',
    heroScrollHint: 'Geser',

    // Profil
    profileEyebrow: 'Profil',
    profileTitle: 'Si Kecil Kami',
    nameMeaningLabel: 'Makna Nama',

    // Makna nama (bagian tersendiri)
    nameStoryEyebrow: '',
    nameStoryTitle: 'Makna Nama',
    nameStoryIntro: '',

    // Detail kelahiran
    birthInfoEyebrow: 'Informasi',
    birthInfoTitleBorn: 'Detail Kelahiran',
    birthInfoTitleWaiting: 'Rencana Kelahiran',
    birthLabelDate: 'Tanggal',
    birthLabelTime: 'Waktu',
    birthLabelWeight: 'Berat',
    birthLabelLength: 'Panjang',
    birthLabelPlace: 'Lokasi',

    // Penghitung usia / hitung mundur
    ageEyebrowBorn: 'Setiap Detik Berharga',
    ageTitleBorn: 'Usia {nama}',
    ageSubtitleBorn: '',
    ageEyebrowWaiting: 'Menanti dengan Penuh Doa',
    ageTitleWaiting: 'Menuju Hari Kelahiran',
    ageSubtitleWaiting: '',
    ageWaitingNote: 'Rencana persalinan pada',
    ageOverdueNote: 'Si kecil bisa hadir kapan saja.',
    unitDays: 'Hari',
    unitHours: 'Jam',
    unitMinutes: 'Menit',
    unitSeconds: 'Detik',

    // Cerita
    storyEyebrow: 'Cerita',
    storyTitle: 'Sepenggal Kisah',
    storyQuote: '',
    storyFallback:
      'Setiap doa yang terucap, setiap hari yang dinanti, kini berwujud dalam dirimu. Selamat datang, anakku.',
    storySignoff: 'Dengan cinta',

    // Timeline
    timelineEyebrow: 'Perjalanan',
    timelineTitle: 'Timeline Kehamilan',
    timelineEmpty: 'Belum ada momen yang ditambahkan.',
    timelineWeek: 'Minggu {n}',

    // Galeri
    galleryEyebrow: 'Galeri',
    galleryTitle: 'Momen Pertama',
    galleryEmpty: 'Foto akan segera hadir.',

    // Lokasi & dokter
    locationEyebrow: 'Lokasi',
    bornAtPrefix: 'Lahir di',
    mapsButton: 'Buka di Google Maps',
    doctorsLabel: 'Dokter Kami',
    doctorEyebrow: 'Tangan Penuh Kasih',
    doctorTitle: 'Dokter Kami',

    // Statistik
    statsVisitors: 'Pengunjung',
    statsWishes: 'Ucapan & Doa',

    // Ucapan
    wishesEyebrow: 'Ucapan & Doa',
    wishesTitle: 'Kirim Doa Terbaik',
    wishesAllTitle: 'Semua Ucapan',
    wishesEmpty: 'Jadilah yang pertama mengirim doa.',
    wishesNamePlaceholder: 'Nama Anda',
    wishesRelationPlaceholder: 'Hubungan (opsional), mis. Sahabat',
    wishesMessagePlaceholder: 'Tulis ucapan & doa Anda…',
    wishesSubmit: 'Kirim Ucapan',
    wishesSubmitting: 'Mengirim…',
    wishesSuccess: 'Terima kasih! Ucapan Anda sudah tampil di halaman.',
    wishesPending: 'Terima kasih! Ucapan Anda terkirim dan akan tampil setelah disetujui.',
    wishesSubmitError: 'Gagal mengirim ucapan. Coba lagi.',
    wishesNameRequired: 'Nama wajib diisi.',
    wishesMessageRequired: 'Ucapan wajib diisi.',
    wishesSeeAll: 'Lihat Semua Ucapan',
    wishesTotal: 'Total {n} ucapan & doa',
    wishesAllEmpty: 'Belum ada ucapan.',

    // Kado
    giftEyebrow: 'Tanda Kasih',
    giftTitle: 'Kado & Hadiah',
    giftIntro: 'Kehadiran dan doa Anda adalah hadiah terindah. Bila ingin memberi lebih, berikut caranya.',
    giftTypeBank: 'Transfer Bank',
    giftTypeEwallet: 'E-Wallet',
    giftTypeQris: 'QRIS',
    giftAccountPrefix: 'a.n.',
    giftEmpty: 'Informasi hadiah belum tersedia.',
    copyNumber: 'Salin Nomor',
    copied: 'Tersalin',

    // Bagikan
    shareEyebrow: 'Bagikan',
    shareTitle: 'Sebarkan Kabar Bahagia',
    shareMessage: 'Dengan penuh syukur, kami umumkan kelahiran {nama}. Lihat kabarnya di sini:',
    shareWhatsapp: 'Bagikan ke WhatsApp',
    shareCopyLink: 'Salin Link',
    shareLinkCopied: 'Link tersalin',

    // Footer & umum
    footerThanks: 'Terima kasih atas doa dan kasih sayang yang telah Anda berikan.',
    seoTitleSuffix: 'Pengumuman Kelahiran',
    loadError: 'Gagal memuat data.',
    retry: 'Coba lagi',
    backHome: 'Kembali ke Beranda',
    notFound: 'Halaman tidak ditemukan.',
    noscript: 'Mohon aktifkan JavaScript untuk membuka halaman ini.',

    // Label aksesibilitas (dibaca pembaca layar)
    ariaScrollDown: 'Gulir ke bawah',
    ariaBackToTop: 'Kembali ke atas',
    ariaPlayMusic: 'Putar musik',
    ariaPauseMusic: 'Jeda musik',
    ariaLightMode: 'Mode terang',
    ariaDarkMode: 'Mode gelap',
    ariaPrevPhoto: 'Foto sebelumnya',
    ariaNextPhoto: 'Foto berikutnya',
    ariaGoToPhoto: 'Ke foto {i}',
    ariaPrevPage: 'Sebelumnya',
    ariaNextPage: 'Berikutnya',
    ariaMap: 'Peta lokasi',
  },

  en: {
    splashEyebrow: 'Birth Announcement',
    splashIntro:
      'With hearts full of love, we are overjoyed to share our happy news and introduce our {anak} to our family, friends, and loved ones.',
    splashButton: 'Open',

    heroScript: 'with grateful hearts',
    heroEyebrowBorn: 'Our {anak} has arrived',
    heroEyebrowWaiting: 'Awaiting the arrival of our {anak}',
    heroTagline: '',
    heroDatePrefix: '',
    heroClosing: '',
    heroScrollHint: 'Scroll',

    profileEyebrow: 'Profile',
    profileTitle: 'Our Little One',
    nameMeaningLabel: 'Meaning of the Name',

    nameStoryEyebrow: '',
    nameStoryTitle: 'The Story Behind the Name',
    nameStoryIntro: '',

    birthInfoEyebrow: 'Details',
    birthInfoTitleBorn: 'Birth Details',
    birthInfoTitleWaiting: 'Birth Plan',
    birthLabelDate: 'Date',
    birthLabelTime: 'Time',
    birthLabelWeight: 'Weight',
    birthLabelLength: 'Length',
    birthLabelPlace: 'Place',

    ageEyebrowBorn: 'Every Second Matters',
    ageTitleBorn: '{nama}’s Age',
    ageSubtitleBorn: '',
    ageEyebrowWaiting: 'Waiting with Prayers',
    ageTitleWaiting: 'Counting Down to Birth Day',
    ageSubtitleWaiting: '',
    ageWaitingNote: 'Expected on',
    ageOverdueNote: 'Any day now.',
    unitDays: 'Days',
    unitHours: 'Hours',
    unitMinutes: 'Minutes',
    unitSeconds: 'Seconds',

    storyEyebrow: 'Our Story',
    storyTitle: 'A Little Story',
    storyQuote: '',
    storyFallback:
      'Every prayer we whispered, every day we waited, has now become you. Welcome to the world, little one.',
    storySignoff: 'With love',

    timelineEyebrow: 'Journey',
    timelineTitle: 'Pregnancy Timeline',
    timelineEmpty: 'No moments added yet.',
    timelineWeek: 'Week {n}',

    galleryEyebrow: 'Gallery',
    galleryTitle: 'First Moments',
    galleryEmpty: 'Photos are coming soon.',

    locationEyebrow: 'Location',
    bornAtPrefix: 'Born at',
    mapsButton: 'Open in Google Maps',
    doctorsLabel: 'Our Doctor',
    doctorEyebrow: 'Caring Hands',
    doctorTitle: 'Our Doctor',

    statsVisitors: 'Visitors',
    statsWishes: 'Well Wishes',

    wishesEyebrow: 'Well Wishes',
    wishesTitle: 'Send Your Prayers',
    wishesAllTitle: 'All Wishes',
    wishesEmpty: 'Be the first to send your wishes.',
    wishesNamePlaceholder: 'Your Name',
    wishesRelationPlaceholder: 'Relationship (optional), e.g. Friend',
    wishesMessagePlaceholder: 'Write your wishes & prayers…',
    wishesSubmit: 'Send Wishes',
    wishesSubmitting: 'Sending…',
    wishesSuccess: 'Thank you! Your wishes are now on the page.',
    wishesPending: 'Thank you! Your wishes will appear once approved.',
    wishesSubmitError: 'Could not send your wishes. Please try again.',
    wishesNameRequired: 'Please enter your name.',
    wishesMessageRequired: 'Please write a message.',
    wishesSeeAll: 'See All Wishes',
    wishesTotal: '{n} wishes in total',
    wishesAllEmpty: 'No wishes yet.',

    giftEyebrow: 'Gifts',
    giftTitle: 'Gifts & Presents',
    giftIntro: 'Your presence and prayers are the most beautiful gift. If you wish to give more, here is how.',
    giftTypeBank: 'Bank Transfer',
    giftTypeEwallet: 'E-Wallet',
    giftTypeQris: 'QRIS',
    giftAccountPrefix: 'Name:',
    giftEmpty: 'Gift details are not available yet.',
    copyNumber: 'Copy Number',
    copied: 'Copied',

    shareEyebrow: 'Share',
    shareTitle: 'Spread the Happy News',
    shareMessage: 'With grateful hearts, we announce the birth of {nama}. See the news here:',
    shareWhatsapp: 'Share on WhatsApp',
    shareCopyLink: 'Copy Link',
    shareLinkCopied: 'Link copied',

    footerThanks: 'Thank you for your prayers and all the love you have given.',
    seoTitleSuffix: 'Birth Announcement',
    loadError: 'Something went wrong while loading.',
    retry: 'Try again',
    backHome: 'Back to Home',
    notFound: 'Page not found.',
    noscript: 'Please enable JavaScript to open this page.',

    ariaScrollDown: 'Scroll down',
    ariaBackToTop: 'Back to top',
    ariaPlayMusic: 'Play music',
    ariaPauseMusic: 'Pause music',
    ariaLightMode: 'Light mode',
    ariaDarkMode: 'Dark mode',
    ariaPrevPhoto: 'Previous photo',
    ariaNextPhoto: 'Next photo',
    ariaGoToPhoto: 'Go to photo {i}',
    ariaPrevPage: 'Previous',
    ariaNextPage: 'Next',
    ariaMap: 'Location map',
  },
};

// Kompatibel dengan versi sebelumnya.
export const DEFAULT_TEXTS = DEFAULT_TEXTS_BY_LOCALE.id;

// Sidik jari og-image.png generik bawaan template. Bila file masih sama,
// generator mengingatkan untuk membuat versi bernama bayi.
export const GENERIC_OG_SHA256 = '0281df711ed2d682d7d09dfbf58f1c23789e31b01794db8da321b4ca3974f6d8';
