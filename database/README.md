# Database

Skema MariaDB, skrip inisialisasi, dan konten.

## Urutan inisialisasi

File di `init/` dijalankan container MariaDB berurutan **hanya saat pertama
kali** (volume `mariadb_data` masih kosong):

| File | Isi | Diedit? |
|---|---|---|
| `01-init.sql` | charset/collation | tidak perlu |
| `02-schema.sql` | tabel & view | hanya bila mengubah skema |
| `03-content.sql` | konten situs | **tidak — dibuat otomatis** oleh `node scripts/generate.mjs` dari `site.config.js` |

## Memperbarui konten pada database yang sudah berjalan

```bash
./scripts/sync-content.sh                                  # produksi
COMPOSE_FILE=docker-compose.yml ./scripts/sync-content.sh   # lokal
```
Aman diulang; tabel `greetings` (ucapan) & `visitor_logs` tidak disentuh.

## Migrasi skema

Perubahan struktur tabel ditulis sebagai file SQL di `migrations/`
(mis. `2026-10-01-tambah-kolom.sql`) dan dijalankan manual. Perbarui juga
`02-schema.sql` agar database baru langsung memakai skema terbaru.

## Reset database

```bash
docker compose down -v   # PERINGATAN: -v menghapus volume data (termasuk ucapan)
docker compose up -d
```
