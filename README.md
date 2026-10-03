# Template Website Pengumuman Kelahiran 👶

Template siap pakai berbasis website **Filo** — pengumuman kelahiran bergaya
undangan digital premium, *mobile-first*, lengkap dengan hitung mundur/usia,
timeline kehamilan, galeri, peta, ucapan & doa, statistik pengunjung, musik
latar, dark mode, dan preview link WhatsApp.

**Untuk klien baru, Anda hanya mengisi satu file: [`site.config.js`](site.config.js).**

| Layer      | Teknologi                                            |
|------------|------------------------------------------------------|
| Frontend   | Vue 3, Vite, Vue Router, Pinia, Tailwind CSS, Axios  |
| Backend    | Node.js, Express (MVC), Sequelize, REST API          |
| Database   | MariaDB 11, phpMyAdmin                               |
| Deployment | Docker Compose, Nginx reverse proxy, Let's Encrypt   |

---

## Membuat situs untuk klien baru (5 langkah)

```bash
# 0. Salin folder template ini menjadi folder baru per klien
cp -r filo-template situs-aruna && cd situs-aruna
```

**1. Kumpulkan data** — kirim [`KUESIONER-DATA.md`](KUESIONER-DATA.md) ke orang tua
(ada template pesan WhatsApp di bagian bawahnya).

**2. Taruh foto & musik**
```
frontend/public/images/   ← foto bayi, orang tua, galeri, USG, dokter, QRIS
frontend/public/music/    ← lagu latar (.mp3), opsional
```
Hapus folder `frontend/public/images/placeholder/` bila semua foto asli sudah ada.

**3. Isi `site.config.js`** — data di dalamnya adalah contoh fiktif; ganti semuanya.

**4. Generate**
```bash
node scripts/generate.mjs          # atau: npm run generate
python3 scripts/make-og-image.py   # opsional: gambar preview link bernama bayi (butuh Pillow)
```
Generator memvalidasi isian (format tanggal, file foto yang hilang, foto
terlalu besar, dll.) lalu membuat:

| File hasil | Isi |
|---|---|
| `database/init/03-content.sql` | data bayi, orang tua, dokter, timeline, galeri, musik, kado |
| `frontend/src/config/site.generated.js` | teks, bagian halaman, lokasi, SEO |
| `frontend/src/config/theme.generated.css` | warna tema |
| `frontend/public/favicon.svg` | favicon dengan huruf monogram |

**5. Jalankan**
```bash
cp .env.example .env     # set APP_NAME, password DB, dll.
docker compose up -d --build
```
Buka http://localhost (website), http://localhost/api/health (cek backend),
http://localhost:8080 (phpMyAdmin). Untuk produksi + HTTPS lihat
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Mengubah konten setelah situs tayang

Contoh: bayi sudah lahir → isi jam, berat, panjang; tambah foto galeri.

```bash
# edit site.config.js (dan tambah foto di frontend/public/images/)
./scripts/sync-content.sh                              # produksi
COMPOSE_FILE=docker-compose.yml ./scripts/sync-content.sh   # lokal
```
Script ini generate ulang, menerapkan konten ke database yang sedang berjalan,
dan rebuild frontend. **Ucapan pengunjung & statistik tidak terhapus.**
Tidak perlu lagi menulis file migrasi SQL manual seperti di repo Filo.

> Jangan mengganti `site.slug` setelah situs tayang — ucapan pengunjung terikat
> ke slug tersebut.

---

## Apa saja yang bisa diatur di `site.config.js`

| Bagian | Isi |
|---|---|
| `site` | slug, URL, **tema warna** (`gold`, `rose`, `sage`, `sky`, `lavender`, atau warna hex sendiri), huruf monogram, **zona waktu** (WIB/WITA/WIT), teks footer |
| `baby` | nama lengkap & panggilan, gender (menentukan kata "putra"/"putri"), tanggal/jam/berat/panjang/tempat lahir, kalimat sambutan, foto profil, makna nama |
| `parents`, `doctors` | nama, panggilan, foto |
| `timeline`, `gallery` | momen kehamilan & foto galeri |
| `music` | lagu latar (atau `null`) |
| `location` | peta Google Maps + catatan |
| `gifts` | rekening, e-wallet, QRIS |
| `sections` | nyalakan/matikan tiap bagian halaman |
| `texts` | ganti teks apa pun (daftar lengkap di [`scripts/lib/defaults.mjs`](scripts/lib/defaults.mjs)); bisa pakai `{nama}` dan `{anak}` |
| `seo` | judul, deskripsi, gambar preview link |

Fitur bawaan yang otomatis:
- **Mode penantian** — bila tanggal lahir masih di masa depan, situs menampilkan
  hitung mundur & "Rencana Kelahiran"; setelah lewat, berubah jadi penghitung usia.
- Data yang kosong (jam, berat, dokter, galeri, dst.) otomatis disembunyikan.
- Ucapan langsung tampil, atau pakai moderasi dengan `WISH_AUTO_APPROVE=false`
  di `.env` (setujui lewat phpMyAdmin: tabel `greetings`, ubah `status` → `approved`).

---

## Struktur folder

```
filo-template/
├── site.config.js         ★ satu-satunya file yang diisi per klien
├── KUESIONER-DATA.md      ★ daftar data yang diminta ke klien
├── scripts/
│   ├── generate.mjs       site.config.js -> SQL + config frontend + favicon
│   ├── make-og-image.py   gambar preview link 1200x630 (opsional)
│   ├── sync-content.sh    terapkan perubahan konten ke situs yang berjalan
│   ├── deploy.sh          git pull + build + sinkron konten (produksi)
│   ├── backup.sh / restore.sh / init-letsencrypt.sh / setup-server.sh
│   └── lib/defaults.mjs   teks & tema bawaan
├── frontend/              Vue 3 (Vite) — src/config/ berisi file hasil generate
├── backend/               REST API Express (MVC)
├── database/init/         01-init, 02-schema, 03-content (hasil generate)
├── nginx/  docker/        reverse proxy & konfigurasi container
├── docs/                  arsitektur, API, database, frontend, deployment
├── docker-compose.yml       stack lokal / sederhana
└── docker-compose.prod.yml  stack produksi + HTTPS
```

## Pengembangan lokal (hot reload)

```bash
node scripts/generate.mjs
cp .env.example .env && docker compose up -d mariadb phpmyadmin
cd backend  && cp .env.example .env && npm install && npm run dev   # :3000
cd frontend && npm install && npm run dev                          # :5173
```
Detail di [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## Beberapa situs di satu server

Setiap situs memakai `APP_NAME`, `NGINX_PORT`, dan `PMA_PORT` yang berbeda di
`.env`, sehingga container, volume, dan network tidak bentrok (mis. situs Filo
dan situs teman berjalan berdampingan). Lihat bagian terkait di
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Lisensi

Lihat [`LICENSE`](LICENSE). Font di `scripts/assets/fonts/` berlisensi SIL OFL 1.1.
