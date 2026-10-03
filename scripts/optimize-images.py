#!/usr/bin/env python3
"""
optimize-images.py — kecilkan foto agar website cepat dibuka di HP.

Butuh Python 3 + Pillow:   pip install pillow

    # satu file (dari mana saja) -> frontend/public/images/firli-01.jpg
    python3 scripts/optimize-images.py ~/Downloads/IMG_1234.jpg --name firli-01

    # semua foto di frontend/public/images (kecuali placeholder), nama tetap
    python3 scripts/optimize-images.py --all

Yang dilakukan:
  - memutar foto sesuai orientasi kamera (EXIF)
  - mengecilkan sisi terpanjang ke 1600 px (ubah dengan --max)
  - menyimpan JPEG kualitas 82, progressive
  - MENGHAPUS metadata (merek kamera, tanggal, lokasi GPS) demi privasi
Hasil selalu disimpan di frontend/public/images/. Foto asal di luar folder itu
TIDAK disentuh; foto asal yang sudah di dalam folder itu diganti versi kecilnya.
"""
import argparse
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow belum terpasang. Jalankan: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "frontend" / "public" / "images"
EXTS = {".jpg", ".jpeg", ".png", ".webp", ".heic"}


def optimize(src: Path, name: str | None, max_side: int, quality: int) -> Path:
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)
    if im.mode not in ("RGB", "L"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1] if im.mode in ("RGBA", "LA") else None)
        im = bg
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    IMAGES.mkdir(parents=True, exist_ok=True)
    dest = IMAGES / f"{name or src.stem}.jpg"
    inside_public = IMAGES in src.parents
    before = src.stat().st_size
    tmp = dest.with_suffix(".tmp.jpg")
    im.save(tmp, "JPEG", quality=quality, optimize=True, progressive=True)  # tanpa exif = metadata terhapus
    if inside_public and src != dest and src.exists():
        src.unlink()  # hanya file di folder public yang diganti
    tmp.replace(dest)
    after = dest.stat().st_size
    rel = dest.relative_to(ROOT / "frontend" / "public")
    print(f"✔  /{rel}  {im.width}x{im.height}  {before / 1e6:.1f} MB -> {after / 1e6:.2f} MB")
    return dest


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("files", nargs="*", help="file foto")
    ap.add_argument("--all", action="store_true", help="semua foto di frontend/public/images (kecuali placeholder)")
    ap.add_argument("--name", help="nama file baru tanpa ekstensi (hanya untuk satu file)")
    ap.add_argument("--max", type=int, default=1600, help="sisi terpanjang dalam px (default 1600)")
    ap.add_argument("--quality", type=int, default=82, help="kualitas JPEG 1-95 (default 82)")
    a = ap.parse_args()

    files = [Path(f).resolve() for f in a.files]
    if a.all:
        files += [p for p in IMAGES.rglob("*") if p.suffix.lower() in EXTS and "placeholder" not in p.parts]
    if not files:
        ap.error("sebutkan file foto, atau pakai --all")
    if a.name and len(files) != 1:
        ap.error("--name hanya bisa untuk satu file")
    for f in files:
        if not f.exists():
            print(f"✖  tidak ditemukan: {f}")
            continue
        optimize(f, a.name, a.max, a.quality)
    print("\nJangan lupa sesuaikan path foto di site.config.js, lalu: node scripts/generate.mjs")


if __name__ == "__main__":
    main()
