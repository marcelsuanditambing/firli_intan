-- =============================================================================
-- Database Schema (DDL) — template website pengumuman kelahiran
-- Engine : InnoDB (FK support, transactions)
-- Charset: utf8mb4 / utf8mb4_unicode_ci (full unicode + emoji)
-- Design : One central "babies" table; every feature table references it via
--          baby_id (1:N). Normalised to 3NF.
-- Runs automatically after 01-init.sql on first MariaDB startup.
-- =============================================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS visitor_logs;
DROP TABLE IF EXISTS gifts;
DROP TABLE IF EXISTS music_tracks;
DROP TABLE IF EXISTS greetings;
DROP TABLE IF EXISTS pregnancy_timeline;
DROP TABLE IF EXISTS gallery_photos;
DROP TABLE IF EXISTS parents;
DROP TABLE IF EXISTS babies;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1) babies — central profile (Feature 1: Informasi Bayi)
-- -----------------------------------------------------------------------------
CREATE TABLE babies (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(120)    NOT NULL,                 -- public URL identifier
  name          VARCHAR(100)    NOT NULL,                 -- nama
  birth_date    DATE            NOT NULL,                 -- tanggal lahir
  birth_time    TIME            NULL,                     -- jam lahir
  weight_grams  INT UNSIGNED    NULL,                     -- berat badan (gram, atomic)
  length_cm     DECIMAL(4,1)    NULL,                     -- panjang badan (cm)
  birth_place   VARCHAR(150)    NULL,                     -- lokasi lahir (rumah sakit)
  birth_city    VARCHAR(100)    NULL,                     -- kota
  description   TEXT            NULL,                     -- deskripsi / cerita
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_babies_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2) parents — parent profiles (Feature 7: Data Orang Tua)
-- -----------------------------------------------------------------------------
CREATE TABLE parents (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id          BIGINT UNSIGNED NOT NULL,
  role             ENUM('mother','father','guardian','doctor') NOT NULL,
  full_name        VARCHAR(100)    NOT NULL,
  nickname         VARCHAR(50)     NULL,
  photo_url        VARCHAR(255)    NULL,
  bio              TEXT            NULL,
  instagram_handle VARCHAR(50)     NULL,
  sort_order       INT             NOT NULL DEFAULT 0,
  created_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_parents_baby (baby_id),
  CONSTRAINT fk_parents_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3) gallery_photos — photo gallery (Feature 2: Gallery Foto)
-- -----------------------------------------------------------------------------
CREATE TABLE gallery_photos (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id       BIGINT UNSIGNED NOT NULL,
  image_url     VARCHAR(255)    NOT NULL,
  thumbnail_url VARCHAR(255)    NULL,
  caption       VARCHAR(255)    NULL,
  alt_text      VARCHAR(150)    NULL,
  sort_order    INT             NOT NULL DEFAULT 0,
  is_featured   TINYINT(1)      NOT NULL DEFAULT 0,
  is_published  TINYINT(1)      NOT NULL DEFAULT 1,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_baby (baby_id),
  KEY idx_gallery_order (baby_id, sort_order),
  CONSTRAINT fk_gallery_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4) pregnancy_timeline — pregnancy journey (Feature 3: Timeline Kehamilan)
-- -----------------------------------------------------------------------------
CREATE TABLE pregnancy_timeline (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id     BIGINT UNSIGNED NOT NULL,
  title       VARCHAR(150)    NOT NULL,
  description TEXT            NULL,
  event_date  DATE            NULL,
  week_number TINYINT UNSIGNED NULL,                     -- minggu kehamilan (1-42)
  image_url   VARCHAR(255)    NULL,
  sort_order  INT             NOT NULL DEFAULT 0,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_timeline_baby (baby_id),
  KEY idx_timeline_order (baby_id, sort_order),
  CONSTRAINT fk_timeline_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5) greetings — visitor wishes & prayers (Feature 4: Ucapan dan Doa)
-- -----------------------------------------------------------------------------
CREATE TABLE greetings (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id       BIGINT UNSIGNED NOT NULL,
  guest_name    VARCHAR(100)    NOT NULL,
  guest_relation VARCHAR(60)    NULL,                     -- mis. "Teman Mama"
  message       TEXT            NOT NULL,
  status        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  ip_hash       CHAR(64)        NULL,                     -- hash IP (privasi)
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_greetings_baby_status (baby_id, status),
  CONSTRAINT fk_greetings_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6) music_tracks — background music (Feature 6: Musik Background)
-- -----------------------------------------------------------------------------
CREATE TABLE music_tracks (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id    BIGINT UNSIGNED NOT NULL,
  title      VARCHAR(150)    NOT NULL,
  artist     VARCHAR(100)    NULL,
  file_url   VARCHAR(255)    NOT NULL,
  is_active  TINYINT(1)      NOT NULL DEFAULT 0,          -- track yang diputar
  sort_order INT             NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_music_baby (baby_id),
  CONSTRAINT fk_music_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7) gifts — gift / QRIS / transfer info (Feature 8: Data Gift / QRIS)
-- -----------------------------------------------------------------------------
CREATE TABLE gifts (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id        BIGINT UNSIGNED NOT NULL,
  type           ENUM('qris','bank_transfer','e_wallet') NOT NULL,
  provider_name  VARCHAR(80)     NOT NULL,                -- BCA, GoPay, OVO, DANA, QRIS
  account_name   VARCHAR(120)    NULL,                    -- atas nama
  account_number VARCHAR(60)     NULL,                    -- no. rekening / no. e-wallet
  qris_image_url VARCHAR(255)    NULL,                    -- gambar QRIS
  note           VARCHAR(255)    NULL,                    -- instruksi tambahan
  sort_order     INT             NOT NULL DEFAULT 0,
  is_active      TINYINT(1)      NOT NULL DEFAULT 1,
  created_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gifts_baby (baby_id),
  CONSTRAINT fk_gifts_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8) visitor_logs — raw visit log (Feature 5: Statistik Pengunjung)
--    Source of truth for statistics; aggregate via queries or the view below.
-- -----------------------------------------------------------------------------
CREATE TABLE visitor_logs (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  baby_id    BIGINT UNSIGNED NOT NULL,
  session_id CHAR(36)        NULL,                        -- UUID untuk hitung unik
  ip_hash    CHAR(64)        NULL,                        -- hash IP (privasi)
  user_agent VARCHAR(255)    NULL,
  referrer   VARCHAR(255)    NULL,
  page_path  VARCHAR(150)    NULL,
  country    VARCHAR(60)     NULL,
  visited_at DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_visitor_baby_time (baby_id, visited_at),
  KEY idx_visitor_session (session_id),
  CONSTRAINT fk_visitor_baby FOREIGN KEY (baby_id)
    REFERENCES babies (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- Convenience VIEW: daily visitor statistics (derived, not stored -> stays 3NF)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_visitor_daily_stats AS
SELECT
  baby_id,
  DATE(visited_at)                      AS stat_date,
  COUNT(*)                              AS total_views,
  COUNT(DISTINCT session_id)            AS unique_sessions
FROM visitor_logs
GROUP BY baby_id, DATE(visited_at);
