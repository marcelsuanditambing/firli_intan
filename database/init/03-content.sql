-- =============================================================================
-- Dibuat otomatis oleh scripts/generate.mjs dari site.config.js — JANGAN diedit manual.
-- Konten situs "aruna". Dijalankan otomatis saat MariaDB pertama kali
-- start, atau manual lewat ./scripts/sync-content.sh untuk memperbarui konten.
-- Aman diulang: data bayi di-upsert, konten dihapus lalu diisi ulang.
-- Tabel greetings (ucapan) & visitor_logs (statistik) tidak disentuh.
-- =============================================================================
SET NAMES utf8mb4;
START TRANSACTION;

-- Bayi (upsert berdasarkan slug)
INSERT INTO babies (slug, name, birth_date, birth_time, weight_grams, length_cm, birth_place, birth_city, description)
VALUES ('aruna', 'Aruna Kirana Maheswari', '2026-09-01', '08:42:00', 3200, 49.5, 'RS Contoh Sehat', 'Jakarta', 'Dengan penuh doa dan sukacita, kami menyambut kehadiran putri kecil kami, Aruna.')
ON DUPLICATE KEY UPDATE name = VALUES(name), birth_date = VALUES(birth_date), birth_time = VALUES(birth_time),
  weight_grams = VALUES(weight_grams), length_cm = VALUES(length_cm), birth_place = VALUES(birth_place),
  birth_city = VALUES(birth_city), description = VALUES(description);

SET @baby_id := (SELECT id FROM babies WHERE slug = 'aruna');

-- Orang tua & dokter
DELETE FROM parents WHERE baby_id = @baby_id;
INSERT INTO parents (baby_id, role, full_name, nickname, photo_url, bio, sort_order) VALUES
  (@baby_id, 'father', 'Bima Pratama', 'Bima', '/images/placeholder/father.svg', NULL, 1),
  (@baby_id, 'mother', 'Sekar Ayuningtyas', 'Sekar', '/images/placeholder/mother.svg', NULL, 2),
  (@baby_id, 'doctor', 'dr. Nama Dokter, Sp.OG', 'Spesialis Obstetri & Ginekologi', '/images/placeholder/doctor.svg', 'Dokter kandungan yang mendampingi kehamilan hingga persalinan Aruna.', 100);

-- Timeline kehamilan
DELETE FROM pregnancy_timeline WHERE baby_id = @baby_id;
INSERT INTO pregnancy_timeline (baby_id, title, description, event_date, week_number, image_url, sort_order) VALUES
  (@baby_id, 'Garis dua pertama', 'Hari kami tahu kamu hadir.', '2025-12-05', 5, NULL, 1),
  (@baby_id, 'USG pertama', 'Detak jantung pertama terdengar.', '2026-01-10', 10, '/images/placeholder/timeline.svg', 2),
  (@baby_id, 'Mengetahui jenis kelamin', 'Ternyata kamu perempuan!', '2026-04-02', 22, NULL, 3),
  (@baby_id, 'Hari kelahiran', 'Aruna lahir dengan sehat.', '2026-09-01', 39, NULL, 4);

-- Galeri foto
DELETE FROM gallery_photos WHERE baby_id = @baby_id;
INSERT INTO gallery_photos (baby_id, image_url, caption, alt_text, sort_order, is_featured, is_published) VALUES
  (@baby_id, '/images/placeholder/gallery-1.svg', 'Pertama kali di rumah', 'Pertama kali di rumah', 1, 1, 1),
  (@baby_id, '/images/placeholder/gallery-2.svg', 'Tidur pulas', 'Tidur pulas', 2, 0, 1),
  (@baby_id, '/images/placeholder/gallery-3.svg', 'Senyum kecil', 'Senyum kecil', 3, 0, 1);

-- Musik latar
DELETE FROM music_tracks WHERE baby_id = @baby_id;

-- Kado / QRIS
DELETE FROM gifts WHERE baby_id = @baby_id;
INSERT INTO gifts (baby_id, type, provider_name, account_name, account_number, qris_image_url, note, sort_order, is_active) VALUES
  (@baby_id, 'bank_transfer', 'BCA', 'Bima Pratama', '1234567890', NULL, NULL, 1, 1),
  (@baby_id, 'e_wallet', 'GoPay', 'Sekar Ayuningtyas', '081234567890', NULL, NULL, 2, 1),
  (@baby_id, 'qris', 'QRIS', 'Keluarga Pratama', NULL, '/images/placeholder/qris.svg', 'Scan untuk memberi hadiah.', 3, 1);

COMMIT;
