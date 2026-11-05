import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    origin:
      process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*'
        ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
        : '*',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    name: process.env.DB_NAME || 'baby_db',
    user: process.env.DB_USER || 'baby_user',
    password: process.env.DB_PASSWORD || '',
    dialect: process.env.DB_DIALECT || 'mariadb',
    sync: String(process.env.DB_SYNC).toLowerCase() === 'true',
  },
  app: {
    ipHashSalt: process.env.IP_HASH_SALT || 'change-me-default-salt',
    // Frontend selalu mengirim ?baby=<slug>. Ini hanya cadangan; bila kosong
    // atau tidak ditemukan, dipakai bayi pertama di database.
    defaultBabySlug: process.env.DEFAULT_BABY_SLUG || '',
    // true  = ucapan langsung tampil (perilaku Filo)
    // false = ucapan berstatus "pending", setujui manual lewat phpMyAdmin
    wishAutoApprove: String(process.env.WISH_AUTO_APPROVE ?? 'true').toLowerCase() !== 'false',
  },
  // Buku Kenangan (PDF A5) untuk orang tua. Kosongkan KEEPSAKE_PIN = fitur mati.
  keepsake: {
    pin: String(process.env.KEEPSAKE_PIN || '').replace(/\s+/g, ''),
    // Alamat frontend dari sisi backend (di Docker: nama service "frontend").
    renderUrl: String(process.env.KEEPSAKE_RENDER_URL || 'http://frontend').replace(/\/+$/, ''),
    // Lokasi Chromium; kosong = dicari otomatis (/usr/bin/chromium-browser, dst.).
    chromiumPath: process.env.CHROMIUM_PATH || process.env.PUPPETEER_EXECUTABLE_PATH || '',
    maxAttempts: 5, // salah PIN sebanyak ini -> dikunci
    lockMinutes: 15, // lama kunci
    tokenDays: 30, // perangkat orang tua diingat selama ini
  },
};

export default config;
