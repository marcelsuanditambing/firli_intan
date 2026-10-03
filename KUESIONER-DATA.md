# Kuesioner Data — Website Pengumuman Kelahiran

Kirim daftar ini ke orang tua (klien). Setiap jawaban langsung dipindahkan ke
**`site.config.js`** — kolom "→" menunjukkan tempatnya.

Tanda: **(wajib)** harus ada agar situs bisa dibuat · *(opsional)* boleh
dilewati, bagiannya otomatis disembunyikan.

> Situs bisa tayang **sebelum bayi lahir** (mode hitung mundur memakai HPL).
> Jam lahir, berat, panjang, dan foto bayi bisa menyusul setelah lahir.

---

## A. Data Bayi

| # | Pertanyaan | Contoh | → `site.config.js` |
|---|---|---|---|
| A1 | Nama lengkap bayi **(wajib)** | Aruna Kirana Maheswari | `baby.fullName` |
| A2 | Nama panggilan **(wajib)** | Aruna | `baby.nickname` |
| A3 | Jenis kelamin **(wajib)** — laki-laki / perempuan | perempuan | `baby.gender` (`male` / `female`) |
| A4 | Tanggal lahir — atau HPL bila belum lahir **(wajib)** | 1 September 2026 | `baby.birth.date` (`2026-09-01`) |
| A5 | Jam lahir *(opsional)* | 08.42 | `baby.birth.time` (`08:42`) |
| A6 | Zona waktu tempat lahir — WIB / WITA / WIT | WIB | `site.timezone` |
| A7 | Berat lahir *(opsional)* | 3,2 kg | `baby.birth.weightGrams` (`3200`) |
| A8 | Panjang lahir *(opsional)* | 49,5 cm | `baby.birth.lengthCm` (`49.5`) |
| A9 | Nama rumah sakit / klinik *(opsional)* | RS Contoh Sehat | `baby.birth.place` |
| A10 | Kota *(opsional)* | Jakarta | `baby.birth.city` |
| A11 | Kalimat sambutan 1–2 kalimat *(opsional)* | "Dengan penuh doa dan sukacita, kami menyambut…" | `baby.description` |
| A12 | Makna nama per kata *(opsional)* | Aruna = "fajar" (Sanskerta) | `baby.nameMeaning` |

## B. Orang Tua

| # | Pertanyaan | → |
|---|---|---|
| B1 | Nama lengkap Ayah **(wajib)** | `parents[].fullName` |
| B2 | Nama panggilan Ayah (tampil di "Dengan cinta, … & …") | `parents[].nickname` |
| B3 | Nama lengkap Ibu **(wajib)** | `parents[].fullName` |
| B4 | Nama panggilan Ibu | `parents[].nickname` |
| B5 | Foto Ayah & foto Ibu *(opsional, lihat bagian G)* | `parents[].photo` |

## C. Dokter / Bidan *(opsional — boleh lebih dari satu)*

| # | Pertanyaan | → |
|---|---|---|
| C1 | Nama lengkap + gelar | `doctors[].fullName` |
| C2 | Spesialisasi / keterangan singkat | `doctors[].subtitle` |
| C3 | Satu kalimat tentang dokter | `doctors[].bio` |
| C4 | Foto dokter (minta izin dokter dulu) | `doctors[].photo` |

## D. Perjalanan Kehamilan (Timeline) *(opsional)*

Untuk setiap momen (disarankan 3–6 momen, urut dari yang paling awal):

| # | Pertanyaan | Contoh | → |
|---|---|---|---|
| D1 | Judul momen | USG pertama | `timeline[].title` |
| D2 | Cerita singkat 1 kalimat | Detak jantung pertama terdengar. | `timeline[].description` |
| D3 | Tanggal | 10 Januari 2026 | `timeline[].date` |
| D4 | Usia kehamilan (minggu ke-) | 10 | `timeline[].week` |
| D5 | Foto momen (mis. foto USG) *(opsional)* | usg.jpg | `timeline[].image` |

Ide momen: garis dua pertama, USG pertama, dengar detak jantung, tahu jenis
kelamin, baby shower / 7 bulanan, hari kelahiran.

## E. Lokasi Saat Ini *(opsional)*

| # | Pertanyaan | → |
|---|---|---|
| E1 | Mau menampilkan peta lokasi? (ya / tidak) | `location.show` |
| E2 | Judul, mis. "Kediaman Kami" | `location.title` |
| E3 | Nama tempat, mis. "Rumah Orang Tua" | `location.name` |
| E4 | Alamat untuk peta — boleh cukup kelurahan/kota bila tidak ingin alamat lengkap tampil publik | `location.address` |
| E5 | Catatan singkat, mis. "Aruna dan Mama sudah pulang…" | `location.note` |

## F. Kado Digital *(opsional — di Filo bagian ini dimatikan)*

| # | Pertanyaan | → |
|---|---|---|
| F1 | Mau menampilkan info kado / amplop digital? (ya / tidak) | `sections.gift` |
| F2 | Rekening bank: nama bank, nomor, atas nama | `gifts[]` tipe `bank_transfer` |
| F3 | E-wallet: GoPay / OVO / DANA, nomor, atas nama | `gifts[]` tipe `e_wallet` |
| F4 | Gambar QRIS | `gifts[]` tipe `qris` |

## G. Foto & Musik — file yang perlu dikirim

| File | Wajib? | Ketentuan | Letakkan di |
|---|---|---|---|
| Foto profil bayi | disarankan | persegi, min. 600×600 px | `frontend/public/images/` |
| Foto Ayah & Ibu | opsional | persegi / portrait, wajah di tengah | `frontend/public/images/` |
| Foto galeri | disarankan, 3–10 foto | landscape 4:3 paling pas, + caption singkat tiap foto | `frontend/public/images/` |
| Foto timeline (USG, dll.) | opsional | bebas | `frontend/public/images/` |
| Foto dokter | opsional | persegi | `frontend/public/images/` |
| Lagu latar | opsional | MP3, < 8 MB, **judul & penyanyi** | `frontend/public/music/` |

Tips:
- Minta foto **resolusi asli**, lalu kompres ke **< 1,5 MB** per foto sebelum
  dipakai (mis. squoosh.app) — generator akan memberi peringatan bila terlalu besar.
- Nama file tanpa spasi, mis. `aruna-01.jpg`.
- Pastikan klien setuju foto-foto ini tampil di internet publik.

## H. Tampilan & Pengaturan

| # | Pertanyaan | Pilihan | → |
|---|---|---|---|
| H1 | Warna tema | emas (seperti Filo), pink, hijau sage, biru langit, lavender | `site.theme` |
| H2 | Huruf monogram logo (default huruf pertama nama panggilan) | mis. "A" | `site.monogram` |
| H3 | Bagian yang **tidak** ingin ditampilkan | profil, detail lahir, hitung usia, cerita, timeline, galeri, lokasi, dokter, statistik, ucapan, kado, tombol share | `sections` |
| H4 | Ucapan pengunjung langsung tampil, atau disetujui dulu? | langsung / moderasi | `.env` → `WISH_AUTO_APPROVE` |
| H5 | Teks khusus yang ingin diganti (mis. "Si Kecil Kami" → "Jagoan Kecil Kami") | bebas | `texts` |
| H6 | Tulisan kecil di footer | mis. "Dibuat dengan cinta oleh Om Cel" | `site.footerCredit` |

## I. Domain & Publikasi

| # | Pertanyaan | → |
|---|---|---|
| I1 | Alamat situs yang diinginkan, mis. `aruna.domainkamu.com` | `site.url` + `.env` → `DOMAIN` |
| I2 | Kapan situs mulai dibagikan? (sebelum / sesudah lahir) | — |
| I3 | Siapa yang boleh melihat? (publik via link) | — |

---

### Template pesan WhatsApp untuk klien

> Halo! Untuk website kelahiran si kecil, boleh kirimkan data ini ya:
> 1. Nama lengkap & nama panggilan bayi, jenis kelamin
> 2. Tanggal lahir (atau HPL), jam lahir, berat & panjang, RS & kota, zona waktu (WIB/WITA/WIT)
> 3. Nama lengkap & panggilan Ayah dan Ibu
> 4. Makna nama (kalau ada) + 1–2 kalimat sambutan
> 5. Momen kehamilan favorit (judul, tanggal, usia kehamilan, 1 kalimat cerita)
> 6. Foto: bayi, Ayah & Ibu, 3–10 foto galeri (+ caption), foto USG (opsional)
> 7. Dokter/bidan yang menangani (opsional: nama, gelar, foto)
> 8. Lokasi yang boleh ditampilkan di peta (opsional)
> 9. Lagu latar favorit (opsional, judul & penyanyi)
> 10. Warna tema: emas / pink / hijau sage / biru / lavender
> 11. Mau pakai info kado/rekening? (opsional)
>
> Foto kirim sebagai *dokumen/file* ya supaya kualitasnya tidak turun 🙏
