// =============================================================================
// Nilai bawaan untuk site.config.js. Semua yang tidak diisi di site.config.js
// akan memakai nilai di sini. Teks boleh memakai {nama} dan {anak}.
// =============================================================================

// Tema warna aksen. Tambahkan tema baru di sini, atau isi site.theme di
// site.config.js dengan objek { soft, base, deep, blush } untuk warna kustom.
export const PALETTES = {
  gold: { soft: '#E0C896', base: '#C9A86A', deep: '#B08D4F', blush: '#E7D3CE' }, // krem-emas (asli Filo)
  rose: { soft: '#EDC7CC', base: '#D69CA5', deep: '#B5707C', blush: '#F3DDE0' }, // merah muda lembut
  sage: { soft: '#CBD8C1', base: '#9FB38F', deep: '#6E8A5C', blush: '#E4EADB' }, // hijau sage
  sky: { soft: '#C3D8E8', base: '#8DB2CF', deep: '#5A84A6', blush: '#DCE8F1' }, // biru langit
  lavender: { soft: '#DCCFE8', base: '#B59ECC', deep: '#8A6CA8', blush: '#ECE3F2' }, // ungu lavender
};

export const DEFAULT_SITE = {
  slug: '',
  url: '',
  theme: 'gold',
  monogram: null,
  timezone: { offset: '+07:00', label: 'WIB' },
  footerCredit: '',
};

export const DEFAULT_SECTIONS = {
  profile: true,
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

export const DEFAULT_LOCATION = {
  show: true,
  title: 'Kediaman Kami',
  name: '',
  address: '',
  note: '',
};

export const DEFAULT_SEO = {
  title: null,
  description: null,
  ogImage: '/og-image.png',
};

export const DEFAULT_TEXTS = {
  // Layar pembuka
  splashEyebrow: 'Pengumuman Kelahiran',
  splashIntro:
    'Dengan penuh kasih, kami ingin berbagi kabar bahagia dan memperkenalkan {anak} kecil kami kepada keluarga, sahabat dan orang-orang terkasih.',
  splashButton: 'Lihat Selengkapnya',

  // Hero
  heroScript: 'dengan penuh syukur',
  heroEyebrowBorn: 'Telah lahir {anak} kami',
  heroEyebrowWaiting: 'Menantikan kelahiran {anak} kami',
  heroScrollHint: 'Geser',

  // Profil
  profileEyebrow: 'Profil',
  profileTitle: 'Si Kecil Kami',
  nameMeaningLabel: 'Makna Nama',

  // Detail kelahiran
  birthInfoEyebrow: 'Informasi',
  birthInfoTitleBorn: 'Detail Kelahiran',
  birthInfoTitleWaiting: 'Rencana Kelahiran',

  // Penghitung usia / hitung mundur
  ageEyebrowBorn: 'Setiap Detik Berharga',
  ageTitleBorn: 'Usia {nama}',
  ageEyebrowWaiting: 'Menanti dengan Penuh Doa',
  ageTitleWaiting: 'Menuju Hari Kelahiran',
  ageWaitingNote: 'Rencana persalinan pada',

  // Cerita
  storyEyebrow: 'Cerita',
  storyTitle: 'Sepenggal Kisah',
  storyFallback:
    'Setiap doa yang terucap, setiap hari yang dinanti, kini berwujud dalam dirimu. Selamat datang, anakku.',
  storySignoff: 'Dengan cinta',

  // Timeline
  timelineEyebrow: 'Perjalanan',
  timelineTitle: 'Timeline Kehamilan',
  timelineEmpty: 'Belum ada momen yang ditambahkan.',

  // Galeri
  galleryEyebrow: 'Galeri',
  galleryTitle: 'Momen Pertama',
  galleryEmpty: 'Foto akan segera hadir.',

  // Lokasi & dokter
  locationEyebrow: 'Lokasi',
  bornAtPrefix: 'Lahir di',
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

  // Kado
  giftEyebrow: 'Tanda Kasih',
  giftTitle: 'Kado & Hadiah',
  giftIntro: 'Kehadiran dan doa Anda adalah hadiah terindah. Bila ingin memberi lebih, berikut caranya.',

  // Bagikan
  shareEyebrow: 'Bagikan',
  shareTitle: 'Sebarkan Kabar Bahagia',
  shareMessage: 'Dengan penuh syukur, kami umumkan kelahiran {nama}. Lihat kabarnya di sini:',

  // Footer & SEO
  footerThanks: 'Terima kasih atas doa dan kasih sayang yang telah Anda berikan.',
  seoTitleSuffix: 'Pengumuman Kelahiran',
};

// Sidik jari og-image.png generik bawaan template. Bila file masih sama,
// generator mengingatkan untuk membuat versi bernama bayi.
export const GENERIC_OG_SHA256 = '0281df711ed2d682d7d09dfbf58f1c23789e31b01794db8da321b4ca3974f6d8';
