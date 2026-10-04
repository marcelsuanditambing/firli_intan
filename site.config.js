// =============================================================================
//  SITE CONFIG — Firli (Fasabbihka Firliandra Tabrani)
// =============================================================================
//  Setelah mengubah file ini:
//    node scripts/generate.mjs           -> cek isian + buat file konten
//    ./scripts/sync-content.sh           -> terapkan ke situs yang sudah jalan
//
//  MODE PENANTIAN: baby.status = 'expecting' -> hitung mundur ke HPL dan teks
//  versi "menanti". Setelah Firli lahir:
//    1. baby.status = 'born'
//    2. isi baby.birth.date (tanggal asli), time, weightGrams, lengthCm
//    3. tambahkan foto Firli (profilePhoto) & galeri
//    4. ./scripts/sync-content.sh
//  Semua teks berbentuk { expecting, born } otomatis berganti ke versi "born".
//
//  Teks "born" = tulisan asli dari Robby & Intan. Teks "expecting" = versi
//  penyesuaian untuk sebelum lahir (bisa diedit bebas).
// =============================================================================

export default {
  // ---------------------------------------------------------------------------
  // 1. PENGATURAN SITUS
  // ---------------------------------------------------------------------------
  site: {
    slug: 'firli',
    url: 'https://firli.cels.site',
    locale: 'en', // seluruh situs berbahasa Inggris
    theme: 'silver', // silver · putih  (sebelumnya 'navy' = navy · silver · putih)
    monogram: 'F',
    timezone: { offset: '+07:00', label: 'WIB' },
    footerCredit: 'Made with love by Uncle Andi Tambing',
  },

  // ---------------------------------------------------------------------------
  // 2. DATA BAYI
  // ---------------------------------------------------------------------------
  baby: {
    fullName: 'Fasabbihka Firliandra Tabrani',
    nickname: 'Firli',
    gender: 'male',
    status: 'expecting', // 'expecting' (sebelum lahir) | 'born' (sudah lahir)

    birth: {
      date: '2026-10-14', // HPL — ganti dengan tanggal lahir asli setelah lahir
      time: null, // mis. '08:42'
      weightGrams: null, // mis. 3200 (gram)
      lengthCm: null, // mis. 49.5
      place: 'Mayapada Hospital Kuningan',
      city: null,
      // Alamat resmi (mayapadahospital.com) — tampil di Birth Details + peta Google Maps
      address: 'Jl. H. R. Rasuna Said Blok C Kav. 17, Karet Kuningan, Setiabudi, Jakarta Selatan 12940',
    },

    // Dipakai untuk deskripsi SEO/preview link.
    description: {
      expecting: 'With the grace of Allah, our little blessing is on his way.',
      born: 'With the grace of Allah, our little blessing has arrived.',
    },

    // Foto Firli (bulat, persegi min. 600x600). Tampil di bagian pembuka.
    // Contoh: '/images/firli.jpg'
    profilePhoto: null,

    // Page 3 — makna nama. { part, meaning } = kartu, { text } = paragraf doa.
    nameMeaning: [
      {
        part: 'Fasabbihka',
        meaning: 'Inspired by fa-sabbih, carrying the meaning of glorifying and praising Allah.',
      },
      {
        part: 'Firliandra',
        meaning:
          'Firli, inspired by Rabbi-ghfir lī, a prayer for Allah’s forgiveness and grace; and Andra, symbolizing strength, courage, and nobility.',
      },
      {
        text: 'Together, his name carries a simple prayer: May he grow with a heart that remembers Allah, a soul guided by His grace, and the strength and courage to walk through life with goodness and grace.',
      },
      {
        part: 'Tabrani',
        meaning: 'His family name, carrying his roots and the family he belongs to.',
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // 3. ORANG TUA
  // ---------------------------------------------------------------------------
  parents: [
    { role: 'father', nickname: 'Robby' },
    { role: 'mother', nickname: 'Intan' },
  ],

  // ---------------------------------------------------------------------------
  // 4. DOKTER — Page 8. Gelar tampil di baris kedua; bio per paragraf.
  // ---------------------------------------------------------------------------
  doctors: [
    {
      fullName: 'dr. Darrell Fernando',
      credentials: 'Sp.OG, SubspFER, MRCOG, MM, MARS, FICS, Int.aff.RANZCOG',
      photo: '/images/dokter.jpg',
      bio: {
        expecting: [
          'The doctor who has cared for us through every step of this journey — from the very beginning of our pregnancy to the moment we will finally meet our little boy, Firliandra.',
          'Thank you for being there through the worries, the little milestones, and the countless questions. We are so grateful that you will be the one to help bring Firliandra safely into our arms 🤍',
        ],
        born: [
          'The doctor who cared for us through every step of this journey — from the very beginning of our pregnancy to the moment we finally met our little boy, Firliandra.',
          'Thank you for being there through the worries, the little milestones, the countless questions, and finally, the most beautiful moment of all. We will always be grateful that you were the one who helped bring Firliandra safely into our arms 🤍',
        ],
      },
    },
  ],

  // Timeline kehamilan tidak dipakai.
  timeline: [],

  // ---------------------------------------------------------------------------
  // 5. GALERI — Page 7. Bingkai portrait 4:5 (layout.galleryAspect).
  //    Sementara berisi foto Robby & Intan; tambahkan foto Firli setelah lahir:
  //    { image: '/images/firli-01.jpg', caption: '' }
  //    Kompres foto baru dulu: python3 scripts/optimize-images.py <file> --name firli-01
  // ---------------------------------------------------------------------------
  gallery: [
    { image: '/images/robby.jpg', alt: 'Robby' },
    { image: '/images/intan.jpg', alt: 'Intan' },
  ],

  // ---------------------------------------------------------------------------
  // 6. MUSIK — (They Long to Be) Close to You, The Carpenters
  // ---------------------------------------------------------------------------
  music: {
    title: 'Close to You',
    artist: 'The Carpenters',
    file: '/music/close-to-you.mp3',
  },

  // Alamat rumah tidak ditampilkan.
  location: { show: false },

  // Kado digital tidak dipakai.
  gifts: [],

  // ---------------------------------------------------------------------------
  // 7. BAGIAN HALAMAN & URUTAN (Page 1 = layar pembuka, Page 2 = pembuka/hero)
  // ---------------------------------------------------------------------------
  sections: {
    profile: false,
    nameStory: true, // Page 3
    story: true, // Page 4
    birthInfo: true, // Page 5
    ageCounter: true, // Page 6
    timeline: false,
    gallery: true, // Page 7
    location: false,
    doctors: true, // Page 8
    stats: true, // Page 9
    wishes: true, // Page 9
    gift: false,
    share: false,
  },

  layout: {
    splashTextFirst: true, // Page 1: kalimat di atas nama
    splashName: 'nickname', // Page 1: "FIRLI"
    heroPhoto: true, // Page 2: foto Firli bila profilePhoto diisi
    storyPhoto: '/images/mom-dad.jpg', // Page 4: foto Mom & Dad berdua
    galleryAspect: '4/5', // Page 7: bingkai portrait
    birthMap: true, // Page 5: alamat + peta Mayapada Hospital Kuningan
    // Dekorasi agar tema silver tidak polos:
    decor: {
      pattern: 'geometric', // pola bintang delapan perak tipis (selang-seling dengan bagian putih)
      heroFrame: 'arch', // bingkai lengkung di layar pembuka & Page 2
      foilName: true, // kilau perak pada nama FIRLI & nama lengkap
    },
    footerName: 'nickname', // Page 10: "Firli"
    order: ['nameStory', 'story', 'birthInfo', 'ageCounter', 'gallery', 'doctors', 'stats', 'wishes'],
  },

  // ---------------------------------------------------------------------------
  // 8. TEKS — dari Robby & Intan. { expecting, born } = beda sebelum/sesudah lahir.
  // ---------------------------------------------------------------------------
  texts: {
    // Page 1 — layar pembuka
    splashEyebrow: '',
    splashIntro: {
      expecting:
        'With hearts full of love, we are overjoyed to share our happy news: our little boy is on his way to our family,',
      born: 'With hearts full of love, we are overjoyed to share our happy news and introduce our little boy to our family,',
    },
    splashButton: 'Meet Firli',

    // Page 2 — pembuka
    heroScript: {
      expecting: 'With the grace of Allah, our little blessing is on his way.',
      born: 'With the grace of Allah, our little blessing has arrived.',
    },
    heroEyebrowBorn: '',
    heroEyebrowWaiting: '',
    heroTagline: {
      expecting: 'Our answered prayer, soon to be in our arms.',
      born: 'Our answered prayer, now safely in our arms.',
    },
    heroDatePrefix: { expecting: 'Expected', born: '' },
    heroClosing: {
      expecting: 'With love and gratitude, we are counting the days to welcome our beloved son, Firli.',
      born: 'With love and gratitude, we welcome our beloved son, Firli.',
    },

    // Page 3 — makna nama
    nameStoryEyebrow: '',
    nameStoryTitle: 'The story behind his name',
    nameStoryIntro: 'is a name woven from faith, prayer, and hope.',

    // Page 4 — cerita & orang tua
    storyEyebrow: '',
    storyTitle: '',
    storyQuote: {
      expecting:
        'With hearts full of gratitude and joy, we await our precious little boy, Firli. Alhamdulillah, our greatest blessing is almost here. May Allah always guide his steps, protect his heart, and fill his life with love.',
      born: 'With hearts full of gratitude and joy, we welcome our precious little boy, Firli. Alhamdulillah, our greatest blessing has arrived. May Allah always guide his steps, protect his heart, and fill his life with love.',
    },
    storySignoff: 'With love,',

    // Page 5 — detail kelahiran
    birthInfoEyebrow: '',
    birthInfoTitleBorn: 'Birth Details',
    birthInfoTitleWaiting: 'Birth Details',
    birthLabelDate: { expecting: 'Due Date', born: 'Date' },
    birthLabelTime: 'Time',
    birthLabelWeight: 'Weight',
    birthLabelLength: 'Length',
    birthLabelPlace: { expecting: 'Hospital', born: 'Born at' },

    // Page 6 — hitung mundur / usia
    ageEyebrowBorn: '',
    ageTitleBorn: 'Every Second Matters',
    ageSubtitleBorn: 'Time since we first met Firli',
    ageEyebrowWaiting: '',
    ageTitleWaiting: 'Every Second Matters',
    ageSubtitleWaiting: 'Until we finally meet Firli',
    ageWaitingNote: 'Expected on',
    ageOverdueNote: 'Any day now, insya Allah.',

    // Page 7 — galeri
    galleryEyebrow: 'Gallery',
    galleryTitle: 'The Beginning of Our Forever',
    galleryEmpty: 'Photos of Firli are coming soon.',

    // Page 8 — dokter
    doctorEyebrow: '',
    doctorTitle: {
      expecting: 'The Doctor Who Is Part of Our Journey',
      born: 'The Doctor Who Was Part of Our Journey',
    },

    // Page 9 — statistik & ucapan
    statsVisitors: 'Visitors',
    statsWishes: 'Well Wishes',
    wishesEyebrow: 'Well Wishes',
    wishesTitle: 'Leave a Little Love',
    wishesNamePlaceholder: 'Your Name',
    wishesRelationPlaceholder: 'Relationship (optional) — e.g. Mom’s Friend',
    wishesMessagePlaceholder: 'Write a message or a little prayer…',
    wishesSubmit: 'Send Your Wishes',
    wishesEmpty: 'Be the first to leave a little love.',
    wishesSeeAll: 'See All Wishes',
    wishesAllTitle: 'All Wishes',

    // Page 10 — penutup
    footerThanks: 'Thank you for keeping Firli in your prayers and surrounding him with so much love.',
  },

  // ---------------------------------------------------------------------------
  // 9. SEO & PREVIEW LINK
  // ---------------------------------------------------------------------------
  seo: {
    title: 'Fasabbihka Firliandra Tabrani · Birth Announcement',
    description: null, // = baby.description
    ogImage: '/og-image.png', // buat ulang: python3 scripts/make-og-image.py
  },
};
