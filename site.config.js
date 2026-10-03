// =============================================================================
//  SITE CONFIG — SATU-SATUNYA FILE YANG PERLU DIISI UNTUK SETIAP KLIEN
// =============================================================================
//  Alur kerja:
//    1. Taruh foto & musik di  frontend/public/images/  dan  frontend/public/music/
//    2. Isi file ini (data di bawah hanyalah CONTOH FIKTIF — ganti semuanya)
//    3. Jalankan:  node scripts/generate.mjs
//       -> membuat seed database, config frontend, favicon & memvalidasi isian
//    4. Jalankan stack:  docker compose up -d --build
//
//  Aturan pengisian:
//    - Path gambar/musik ditulis relatif ke folder frontend/public,
//      diawali "/"  (contoh: '/images/profil.jpg').
//    - Tanggal: 'YYYY-MM-DD'  (contoh: '2026-09-01').  Jam: 'HH:MM'  (24 jam).
//    - Isi null atau hapus baris untuk data yang belum ada; bagiannya
//      otomatis disembunyikan di situs.
//    - Teks boleh memakai penanda:  {nama} = nama panggilan bayi,
//      {anak} = "putri"/"putra" (mengikuti gender).
//  Daftar pertanyaan untuk klien: lihat KUESIONER-DATA.md
// =============================================================================

export default {
  // ---------------------------------------------------------------------------
  // 1. PENGATURAN SITUS
  // ---------------------------------------------------------------------------
  site: {
    // ID unik situs: huruf kecil, angka, tanda hubung. Dipakai di database.
    slug: 'aruna',
    // Alamat final situs (untuk SEO & preview link WhatsApp). Kosongkan jika belum ada.
    url: 'https://aruna.example.com',
    // Tema warna aksen: 'gold' | 'rose' | 'sage' | 'sky' | 'lavender'
    theme: 'gold',
    // Huruf di logo lingkaran & favicon. null = huruf pertama nama panggilan.
    monogram: null,
    // Zona waktu kelahiran (dipakai hitung mundur/usia & label jam).
    //   WIB -> '+07:00'   WITA -> '+08:00'   WIT -> '+09:00'
    timezone: { offset: '+07:00', label: 'WIB' },
    // Tulisan kecil di paling bawah halaman.
    footerCredit: 'Dibuat dengan cinta',
  },

  // ---------------------------------------------------------------------------
  // 2. DATA BAYI
  // ---------------------------------------------------------------------------
  baby: {
    fullName: 'Aruna Kirana Maheswari',
    nickname: 'Aruna',
    gender: 'female', // 'female' (putri) | 'male' (putra)

    birth: {
      date: '2026-09-01', // tanggal lahir — atau rencana/HPL bila belum lahir
      time: '08:42', // null bila belum lahir / tidak ingin ditampilkan
      weightGrams: 3200, // berat dalam GRAM (3,2 kg -> 3200)
      lengthCm: 49.5, // panjang dalam cm
      place: 'RS Contoh Sehat', // nama rumah sakit / klinik
      city: 'Jakarta',
    },

    // Kalimat sambutan (tampil di bagian Profil & Cerita).
    description:
      'Dengan penuh doa dan sukacita, kami menyambut kehadiran putri kecil kami, Aruna.',

    // Foto profil bulat (disarankan persegi, min. 600x600).
    profilePhoto: '/images/placeholder/baby.svg',

    // Makna nama (boleh dikosongkan: []).
    nameMeaning: [
      { part: 'Aruna', meaning: 'Dari bahasa Sanskerta, berarti "fajar" — cahaya pertama di pagi hari.' },
      { part: 'Kirana', meaning: 'Berarti "sinar" atau "cahaya yang indah".' },
      { part: 'Maheswari', meaning: 'Berarti "perempuan yang mulia".' },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. ORANG TUA  (role: 'father' | 'mother' | 'guardian')
  //    nickname dipakai di "Dengan cinta, Bima & Sekar" dan di footer.
  // ---------------------------------------------------------------------------
  parents: [
    { role: 'father', fullName: 'Bima Pratama', nickname: 'Bima', photo: '/images/placeholder/father.svg' },
    { role: 'mother', fullName: 'Sekar Ayuningtyas', nickname: 'Sekar', photo: '/images/placeholder/mother.svg' },
  ],

  // ---------------------------------------------------------------------------
  // 4. DOKTER / BIDAN yang menangani (boleh []).
  // ---------------------------------------------------------------------------
  doctors: [
    {
      fullName: 'dr. Nama Dokter, Sp.OG',
      subtitle: 'Spesialis Obstetri & Ginekologi',
      photo: '/images/placeholder/doctor.svg',
      bio: 'Dokter kandungan yang mendampingi kehamilan hingga persalinan Aruna.',
    },
  ],

  // ---------------------------------------------------------------------------
  // 5. TIMELINE KEHAMILAN (urut dari yang paling awal). week & image opsional.
  // ---------------------------------------------------------------------------
  timeline: [
    { title: 'Garis dua pertama', description: 'Hari kami tahu kamu hadir.', date: '2025-12-05', week: 5 },
    { title: 'USG pertama', description: 'Detak jantung pertama terdengar.', date: '2026-01-10', week: 10, image: '/images/placeholder/timeline.svg' },
    { title: 'Mengetahui jenis kelamin', description: 'Ternyata kamu perempuan!', date: '2026-04-02', week: 22 },
    { title: 'Hari kelahiran', description: 'Aruna lahir dengan sehat.', date: '2026-09-01', week: 39 },
  ],

  // ---------------------------------------------------------------------------
  // 6. GALERI FOTO (slider). Foto landscape 4:3 paling pas.
  // ---------------------------------------------------------------------------
  gallery: [
    { image: '/images/placeholder/gallery-1.svg', caption: 'Pertama kali di rumah' },
    { image: '/images/placeholder/gallery-2.svg', caption: 'Tidur pulas' },
    { image: '/images/placeholder/gallery-3.svg', caption: 'Senyum kecil' },
  ],

  // ---------------------------------------------------------------------------
  // 7. MUSIK LATAR (mp3). null = tanpa musik (tombol musik disembunyikan).
  //    Contoh: { title: 'Judul Lagu', artist: 'Penyanyi', file: '/music/lagu.mp3' }
  // ---------------------------------------------------------------------------
  music: null,

  // ---------------------------------------------------------------------------
  // 8. LOKASI SAAT INI (peta Google Maps). show:false untuk menyembunyikan.
  // ---------------------------------------------------------------------------
  location: {
    show: true,
    title: 'Kediaman Kami',
    name: 'Rumah Orang Tua',
    // Alamat yang cukup detail agar peta akurat — atau cukup kelurahan/kota
    // bila tidak ingin alamat lengkap tampil publik.
    address: 'Kebayoran Baru, Jakarta Selatan, DKI Jakarta',
    note: 'Aruna dan Mama sudah pulang dari rumah sakit dan kini beristirahat di rumah.',
  },

  // ---------------------------------------------------------------------------
  // 9. KADO / AMPLOP DIGITAL (bagian ini baru tampil bila sections.gift = true)
  //    type: 'bank_transfer' | 'e_wallet' | 'qris'
  // ---------------------------------------------------------------------------
  gifts: [
    { type: 'bank_transfer', provider: 'BCA', accountName: 'Bima Pratama', accountNumber: '1234567890' },
    { type: 'e_wallet', provider: 'GoPay', accountName: 'Sekar Ayuningtyas', accountNumber: '081234567890' },
    { type: 'qris', provider: 'QRIS', accountName: 'Keluarga Pratama', qrisImage: '/images/placeholder/qris.svg', note: 'Scan untuk memberi hadiah.' },
  ],

  // ---------------------------------------------------------------------------
  // 10. BAGIAN HALAMAN — true = tampil, false = sembunyi
  // ---------------------------------------------------------------------------
  sections: {
    profile: true, // foto profil + makna nama
    birthInfo: true, // tanggal, jam, berat, panjang, lokasi lahir
    ageCounter: true, // hitung mundur (sebelum lahir) / usia (sesudah lahir)
    story: true, // kalimat sambutan + foto orang tua
    timeline: true,
    gallery: true,
    location: true, // peta + kartu dokter
    doctors: true,
    stats: true, // jumlah pengunjung & ucapan
    wishes: true, // form ucapan & doa
    gift: false, // kado digital
    share: false, // tombol bagikan WhatsApp / salin link
  },

  // ---------------------------------------------------------------------------
  // 11. TEKS (opsional) — hapus baris mana pun untuk memakai teks bawaan.
  //     Daftar lengkap teks bawaan ada di scripts/lib/defaults.mjs
  // ---------------------------------------------------------------------------
  texts: {
    heroScript: 'dengan penuh syukur',
    splashIntro:
      'Dengan penuh kasih, kami ingin berbagi kabar bahagia dan memperkenalkan {anak} kecil kami kepada keluarga, sahabat dan orang-orang terkasih.',
    footerThanks: 'Terima kasih atas doa dan kasih sayang yang telah Anda berikan.',
  },

  // ---------------------------------------------------------------------------
  // 12. SEO & PREVIEW LINK (opsional)
  // ---------------------------------------------------------------------------
  seo: {
    // null = otomatis "<Nama Lengkap> · Pengumuman Kelahiran"
    title: null,
    // null = memakai baby.description
    description: null,
    // Gambar preview saat link dibagikan (PNG/JPG 1200x630).
    ogImage: '/og-image.png',
  },
};
