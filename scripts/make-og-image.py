#!/usr/bin/env python3
"""
make-og-image.py — buat gambar preview link (Open Graph) 1200x630 bernama bayi.

Opsional. Butuh Python 3 + Pillow:   pip install pillow
Jalankan SETELAH  node scripts/generate.mjs :

    python3 scripts/make-og-image.py

Hasil: frontend/public/og-image.png  (dipakai saat link dibagikan ke WhatsApp,
Instagram, Facebook, dll). Warna mengikuti tema, teks mengikuti site.config.js.
Boleh juga diganti manual dengan desain sendiri (mis. dari Canva) ukuran 1200x630.
"""
import json
import re
import sys
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    sys.exit("Pillow belum terpasang. Jalankan: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "scripts" / "assets" / "fonts"
SITE_JS = ROOT / "frontend" / "src" / "config" / "site.generated.js"
THEME_CSS = ROOT / "frontend" / "src" / "config" / "theme.generated.css"
OUT = ROOT / "frontend" / "public" / "og-image.png"

W, H = 1200, 630
SCALE = 2  # render 2x lalu perkecil -> garis & teks halus


def load_site():
    if not SITE_JS.exists():
        sys.exit("site.generated.js belum ada. Jalankan dulu: node scripts/generate.mjs")
    text = SITE_JS.read_text(encoding="utf-8")
    body = text[text.index("export default") + len("export default"):].strip().rstrip(";")
    return json.loads(body)


def load_theme():
    css = THEME_CSS.read_text(encoding="utf-8") if THEME_CSS.exists() else ""

    def rgb(name, fallback):
        m = re.search(rf"--c-{name}:\s*(\d+)\s+(\d+)\s+(\d+)", css)
        return tuple(int(x) for x in m.groups()) if m else fallback

    return {
        "soft": rgb("gold-soft", (224, 200, 150)),
        "base": rgb("gold", (201, 168, 106)),
        "deep": rgb("gold-deep", (176, 141, 79)),
        "blush": rgb("blush", (231, 211, 206)),
        # Latar & teks mengikuti tema (mode terang)
        "cream": rgb("cream", (250, 247, 241)),
        "ink_soft": rgb("ink-soft", (110, 99, 88)),
        "ink_muted": rgb("ink-muted", (138, 126, 114)),
    }


def font(name, size):
    path = FONTS / name
    try:
        return ImageFont.truetype(str(path), size * SCALE)
    except OSError:
        for fallback in ("DejaVuSerif.ttf", "LiberationSerif-Regular.ttf"):
            try:
                return ImageFont.truetype(fallback, size * SCALE)
            except OSError:
                continue
        return ImageFont.load_default()


def mix(c1, c2, t):
    return tuple(round(a + (b - a) * t) for a, b in zip(c1, c2))


def centered(draw, y, text, fnt, fill, spacing=0):
    s = lambda v: v * SCALE
    if spacing:
        widths = [draw.textlength(ch, font=fnt) for ch in text]
        total = sum(widths) + s(spacing) * (len(text) - 1)
        x = (s(W) - total) / 2
        for ch, w in zip(text, widths):
            draw.text((x, s(y)), ch, font=fnt, fill=fill)
            x += w + s(spacing)
    else:
        w = draw.textlength(text, font=fnt)
        draw.text(((s(W) - w) / 2, s(y)), text, font=fnt, fill=fill)


def main():
    generic = "--generic" in sys.argv  # versi tanpa nama (bawaan template)
    site = load_site()
    if generic:
        site["baby"]["fullName"] = site["baby"]["nickname"] = "Selamat Datang"
    th = load_theme()
    cream = th["cream"]
    ink = th["ink_soft"]
    ink_muted = th["ink_muted"]
    locale = site["site"].get("locale", "id")

    img = Image.new("RGB", (W * SCALE, H * SCALE), cream)
    d = ImageDraw.Draw(img)
    s = lambda v: v * SCALE

    # Lingkaran lembut di sudut
    d.ellipse([s(-140), s(-170), s(380), s(350)], fill=mix(cream, th["blush"], 0.45))
    d.ellipse([s(780), s(260), s(1380), s(860)], fill=mix(cream, th["soft"], 0.35))

    # Bingkai ganda
    d.rectangle([s(28), s(28), s(W - 28), s(H - 28)], outline=th["base"], width=s(2))
    d.rectangle([s(40), s(40), s(W - 40), s(H - 40)], outline=th["soft"], width=s(1))

    # Monogram
    cx, cy, r = W / 2, 180, 70
    d.ellipse([s(cx - r), s(cy - r), s(cx + r), s(cy + r)], outline=th["base"], width=s(2))
    r2 = 60
    d.ellipse([s(cx - r2), s(cy - r2), s(cx + r2), s(cy + r2)], outline=th["soft"], width=s(1))
    if generic:
        # Bintang empat sudut sebagai pengganti huruf
        a, b = 26, 7
        d.polygon([(s(cx), s(cy - a)), (s(cx + b), s(cy - b)), (s(cx + a), s(cy)), (s(cx + b), s(cy + b)),
                   (s(cx), s(cy + a)), (s(cx - b), s(cy + b)), (s(cx - a), s(cy)), (s(cx - b), s(cy - b))], fill=th["deep"])
    else:
        mono = site["site"].get("monogram") or "?"
        f_mono = font("CormorantGaramond-SemiBold.woff", 78)
        bbox = d.textbbox((0, 0), mono, font=f_mono)
        d.text((s(cx) - (bbox[2] - bbox[0]) / 2 - bbox[0], s(cy) - (bbox[3] - bbox[1]) / 2 - bbox[1]), mono, font=f_mono, fill=th["deep"])

    # Eyebrow
    eyebrow = (site["texts"].get("splashEyebrow") or site["texts"].get("seoTitleSuffix") or "Pengumuman Kelahiran").upper()
    centered(d, 292, eyebrow, font("Jost-Regular.woff", 22), th["deep"], spacing=7)

    # Nama (menyusut otomatis agar muat; pakai nama panggilan bila terlalu panjang)
    name = site["baby"]["fullName"]
    size = 118
    f_name = font("CormorantGaramond-SemiBold.woff", size)
    while d.textlength(name, font=f_name) > s(1000) and size > 70:
        size -= 4
        f_name = font("CormorantGaramond-SemiBold.woff", size)
    if d.textlength(name, font=f_name) > s(1000):
        name = site["baby"]["nickname"]
        size = 118
        f_name = font("CormorantGaramond-SemiBold.woff", size)
    bbox = d.textbbox((0, 0), name, font=f_name)
    name_h = (bbox[3] - bbox[1]) / SCALE
    centered(d, 400 - name_h / 2 - bbox[1] / SCALE, name, f_name, ink)

    # Pembatas
    y = 500
    d.line([s(510), s(y), s(580), s(y)], fill=th["base"], width=s(1))
    d.line([s(620), s(y), s(690), s(y)], fill=th["base"], width=s(1))
    d.polygon([(s(600), s(y - 6)), (s(606), s(y)), (s(600), s(y + 6)), (s(594), s(y))], fill=th["base"])

    # Tagline
    default_tagline = {
        "id": "Dengan penuh syukur, kami sambut kehadirannya",
        "en": "With grateful hearts, we welcome our little one",
    }.get(locale, "Dengan penuh syukur, kami sambut kehadirannya")
    desc = (site.get("seo") or {}).get("description") or ""
    tagline = desc if (desc and len(desc) <= 64 and not generic) else default_tagline
    centered(d, 524, tagline, font("CormorantGaramond-MediumItalic.woff", 34), ink_muted)

    img = img.resize((W, H), Image.LANCZOS)
    img.save(OUT, "PNG", optimize=True)
    label = "versi generik" if generic else f"untuk \"{site['baby']['fullName']}\""
    print(f"✔  {OUT.relative_to(ROOT)} dibuat ({W}x{H}) {label}")


if __name__ == "__main__":
    main()
