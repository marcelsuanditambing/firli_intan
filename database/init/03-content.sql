-- =============================================================================
-- Dibuat otomatis oleh scripts/generate.mjs dari site.config.js — JANGAN diedit manual.
-- Konten situs "firli" (mode: expecting). Dijalankan otomatis saat MariaDB
-- pertama kali start, atau manual lewat ./scripts/sync-content.sh.
-- Aman diulang: data bayi di-upsert, konten dihapus lalu diisi ulang.
-- Tabel greetings (ucapan) & visitor_logs (statistik) tidak disentuh.
-- =============================================================================
SET NAMES utf8mb4;
START TRANSACTION;

-- Bayi (upsert berdasarkan slug)
INSERT INTO babies (slug, name, birth_date, birth_time, weight_grams, length_cm, birth_place, birth_city, description)
VALUES ('firli', 'Fasabbihka Firliandra Tabrani', '2026-10-14', NULL, NULL, NULL, 'Mayapada Hospital Kuningan', NULL, 'With the grace of Allah, our little blessing is on his way.')
ON DUPLICATE KEY UPDATE name = VALUES(name), birth_date = VALUES(birth_date), birth_time = VALUES(birth_time),
  weight_grams = VALUES(weight_grams), length_cm = VALUES(length_cm), birth_place = VALUES(birth_place),
  birth_city = VALUES(birth_city), description = VALUES(description);

SET @baby_id := (SELECT id FROM babies WHERE slug = 'firli');

-- Orang tua & dokter
DELETE FROM parents WHERE baby_id = @baby_id;
INSERT INTO parents (baby_id, role, full_name, nickname, photo_url, bio, sort_order) VALUES
  (@baby_id, 'father', 'Robby', 'Robby', NULL, NULL, 1),
  (@baby_id, 'mother', 'Intan', 'Intan', NULL, NULL, 2),
  (@baby_id, 'doctor', 'dr. Darrell Fernando, Sp.OG, Subsp. FER, MRCOG, MM, MARS, FRSPH, FICS, Int.aff.RANZCOG', NULL, '/images/dokter.jpg?v=c1bd2b0b', 'The doctor who has cared for us through every step of this journey — from the very beginning of our pregnancy to the moment we will finally meet our little boy, Firliandra.\n\nThank you for being there through the worries, the little milestones, and the countless questions. We are so grateful that you will be the one to help bring Firliandra safely into our arms 🤍', 100);

-- Timeline kehamilan
DELETE FROM pregnancy_timeline WHERE baby_id = @baby_id;

-- Galeri foto
DELETE FROM gallery_photos WHERE baby_id = @baby_id;
INSERT INTO gallery_photos (baby_id, image_url, caption, alt_text, sort_order, is_featured, is_published) VALUES
  (@baby_id, '/images/robby.jpg?v=6742c415', NULL, 'Robby', 1, 1, 1),
  (@baby_id, '/images/intan.jpg?v=b0e727ab', NULL, 'Intan', 2, 0, 1);

-- Musik latar
DELETE FROM music_tracks WHERE baby_id = @baby_id;
INSERT INTO music_tracks (baby_id, title, artist, file_url, is_active, sort_order) VALUES
  (@baby_id, 'Close to You', 'The Carpenters', '/music/close-to-you.mp3?v=ee4a754c', 1, 1);

-- Kado / QRIS
DELETE FROM gifts WHERE baby_id = @baby_id;

COMMIT;
