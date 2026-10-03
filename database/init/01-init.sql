-- =============================================================================
-- Database initialisation
-- Dijalankan otomatis saat MariaDB container PERTAMA kali start (volume kosong).
-- Database & user aplikasi dibuat oleh image MariaDB dari variabel .env
-- (DB_NAME, DB_USER, DB_PASSWORD). Urutan file: 01 -> 02 -> 03.
--   01-init.sql     charset
--   02-schema.sql   tabel (skema)
--   03-content.sql  konten situs — DIBUAT OTOMATIS dari site.config.js
-- =============================================================================

-- Pastikan UTF-8 penuh (termasuk emoji) untuk database aktif (DB_NAME).
ALTER DATABASE
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
