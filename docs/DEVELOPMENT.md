# Local Development

Kembangkan dengan hot reload **tanpa** Docker untuk frontend/backend, sambil
menjalankan MariaDB lewat Docker.

## 0. Generate konten

```bash
node scripts/generate.mjs      # wajib sebelum frontend dijalankan/di-build
```
Ulangi setiap kali `site.config.js` diubah. Frontend dev server akan memuat
ulang otomatis; untuk memperbarui data di database lokal jalankan
`COMPOSE_FILE=docker-compose.yml ./scripts/sync-content.sh` (atau impor
`database/init/03-content.sql` lewat phpMyAdmin).

## 1. Database saja (Docker)

```bash
cp .env.example .env
docker compose up -d mariadb phpmyadmin
```
Catatan: agar backend lokal bisa terhubung, buka port MariaDB ke host dengan
menambahkan `ports: ["127.0.0.1:3306:3306"]` pada service `mariadb` di
`docker-compose.yml` (khusus lokal).

## 2. Backend

```bash
cd backend
cp .env.example .env       # DB_HOST=localhost, samakan DB_* dengan root .env
npm install
npm run dev                # http://localhost:3000  (node --watch)
```

## 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173 (Vite, proxy /api -> :3000)
```

Vite mem-proxy `/api` ke `http://localhost:3000`, sehingga frontend dan backend
berkomunikasi persis seperti di belakang nginx pada produksi.
