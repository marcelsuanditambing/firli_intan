<script setup>
// =============================================================================
// Buku Kenangan (A5). Dicetak oleh backend (Chromium) menjadi PDF.
//   window.__KEEPSAKE__       data dari server: { baby, gallery, wishes, generated_at }
//   window.__KEEPSAKE_READY__ true setelah huruf, foto & pembagian halaman siap
// Isi tetap (teks, makna nama, foto cerita, tema) dari site.config.js.
// =============================================================================
import { ref, computed, onMounted, nextTick, h } from 'vue';
import { site, texts, sections, layout, t, splitCredentials, paragraphs } from '@/config';
import { formatDate, formatTime, formatWeight, formatLength } from '@/utils/format.js';

// Bintang kecil ✦ sebagai SVG (tidak bergantung pada huruf di server).
const KStar = () =>
  h('svg', { class: 'k-star-svg', viewBox: '0 0 10 10', 'aria-hidden': 'true' }, [
    h('path', { d: 'M5 0C5.4 3.3 6.7 4.6 10 5 6.7 5.4 5.4 6.7 5 10 4.6 6.7 3.3 5.4 0 5 3.3 4.6 4.6 3.3 5 0Z', fill: 'currentColor' }),
  ]);

const data = typeof window !== 'undefined' ? window.__KEEPSAKE__ || null : null;
const baby = data?.baby || {};
const people = baby.parents || [];
const familyParents = people.filter((p) => p.role !== 'doctor');
const doctors = people.filter((p) => p.role === 'doctor');
const gallery = (data?.gallery || []).filter((g) => g.image_url);
const wishes = data?.wishes || [];

document.title = `${site.baby.nickname} · ${texts.keepsakeCoverLabel}`;

// ---- Nilai tampilan ---------------------------------------------------------
const fullName = baby.name || site.baby.fullName;
const nickname = site.baby.nickname || fullName;
const useNickname = layout.splashName === 'nickname';
const coverPhoto = site.site.monogramPhoto || site.baby.profilePhoto || null;
const parentNames = familyParents.map((p) => p.nickname || p.full_name).join(' & ');
const isBorn = (() => {
  if (site.baby.status === 'born') return true;
  if (site.baby.status === 'expecting') return false;
  if (!baby.birth_date) return true;
  const time = baby.birth_time || '00:00:00';
  return new Date(`${baby.birth_date}T${time}${site.site.timezone.offset}`).getTime() <= Date.now();
})();

// Tanggal ISO (UTC) -> tanggal di zona waktu situs (mis. WIB), format YYYY-MM-DD.
function siteDate(iso) {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  const m = /^([+-])(\d{2}):?(\d{2})$/.exec(site.site.timezone?.offset || '+00:00');
  const mins = m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
  return new Date(d.getTime() + mins * 60000).toISOString().slice(0, 10);
}
const birthDateShort = baby.birth_date ? formatDate(baby.birth_date, { withDay: false }) : '';
const madeOn = t('keepsakeMadeOn', { date: formatDate(siteDate(data?.generated_at || new Date().toISOString()), { withDay: false }) });
const wishesCount = wishes.length === 1 ? texts.keepsakeWishesCountOne : t('keepsakeWishesCount', { n: wishes.length });

const nameItems = site.baby.nameMeaning || [];
const storyParas = paragraphs(texts.storyQuote || baby.description || texts.storyFallback);
const storyPhoto = layout.storyPhoto || null;

const facts = [
  { key: 'date', label: texts.birthLabelDate, value: baby.birth_date ? formatDate(baby.birth_date) : '' },
  { key: 'time', label: texts.birthLabelTime, value: formatTime(baby.birth_time) },
].filter((f) => f.value);
const measures = [
  { key: 'weight', label: texts.birthLabelWeight, value: formatWeight(baby.weight_grams) },
  { key: 'length', label: texts.birthLabelLength, value: formatLength(baby.length_cm) },
].filter((f) => f.value);
const place = [baby.birth_place, baby.birth_city].filter(Boolean).join(', ');

function doctorParts(doc) {
  const parts = splitCredentials(doc.full_name || '');
  return { ...parts, bio: paragraphs(doc.bio) };
}

// ---- Ucapan: dibagi ke halaman berdasarkan tinggi sebenarnya ---------------
const measuring = ref(true);
const wishSizes = ref(wishes.map(() => 'md')); // md -> sm -> xs untuk pesan yang sangat panjang
const wishPages = ref([]);
const measureEl = ref(null);
const pxPerMm = ref(3.7795);

function wishMeta(w) {
  return [w.guest_relation, w.created_at ? formatDate(siteDate(w.created_at), { withDay: false }) : '']
    .filter(Boolean)
    .join(' · ');
}

function paginateWishes() {
  const root = measureEl.value;
  if (!root || !wishes.length) return [];
  const mm = pxPerMm.value;
  const areaH = 171 * mm; // tinggi area isi halaman
  const gap = (4.5 + 4.5 + 0.2) * mm; // jarak + garis antar-ucapan
  const headH = root.querySelector('[data-measure="head"]').getBoundingClientRect().height + 5 * mm;
  const heights = [...root.querySelectorAll('[data-measure="wish"]')].map((el) => el.getBoundingClientRect().height);

  const pages = [];
  let current = [];
  let used = 0;
  let cap = areaH - headH;
  heights.forEach((h, i) => {
    const add = current.length ? gap + h : h;
    if (current.length && used + add > cap) {
      pages.push(current);
      current = [];
      used = 0;
      cap = areaH;
    }
    used += current.length ? gap + h : h;
    current.push(i);
  });
  if (current.length) pages.push(current);
  return pages;
}

async function measureWishes() {
  const root = measureEl.value;
  if (!root || !wishes.length) return;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;left:-400mm;top:0;width:100mm;height:100mm;';
  document.body.appendChild(probe);
  pxPerMm.value = probe.getBoundingClientRect().height / 100 || 3.7795;
  probe.remove();

  // Pesan yang lebih tinggi dari satu halaman diperkecil hurufnya (maks. 2 tingkat).
  for (let round = 0; round < 2; round += 1) {
    const els = [...root.querySelectorAll('[data-measure="wish"]')];
    let changed = false;
    els.forEach((el, i) => {
      if (el.getBoundingClientRect().height > 166 * pxPerMm.value && wishSizes.value[i] !== 'xs') {
        wishSizes.value[i] = wishSizes.value[i] === 'md' ? 'sm' : 'xs';
        changed = true;
      }
    });
    if (!changed) break;
    await nextTick();
  }
  wishPages.value = paginateWishes().map((idx) => idx.map((i) => ({ wish: wishes[i], size: wishSizes.value[i] })));
}

// ---- Susunan halaman (mengikuti layout.order & sections) --------------------
const pages = computed(() => {
  const list = [{ type: 'cover' }, { type: 'opening' }];
  const added = new Set();
  const once = (key, fn) => {
    if (!added.has(key)) {
      added.add(key);
      fn();
    }
  };
  for (const key of layout.order || []) {
    if (!sections[key]) continue;
    if ((key === 'nameStory' || key === 'profile') && nameItems.length) once('names', () => list.push({ type: 'names' }));
    if (key === 'story') once('story', () => list.push({ type: 'story' }));
    if (key === 'birthInfo' && (facts.length || measures.length || place)) once('birth', () => list.push({ type: 'birth' }));
    if (key === 'gallery' && gallery.length) {
      once('gallery', () => {
        list.push({ type: 'gallery-first', photo: gallery[0] });
        for (let i = 1; i < gallery.length; i += 4) list.push({ type: 'gallery-grid', photos: gallery.slice(i, i + 4) });
      });
    }
    // Dokter tampil di bagian Lokasi bila Lokasi aktif (sama seperti website).
    if ((key === 'doctors' || key === 'location') && doctors.length && (key === 'location' || !sections.location)) {
      once('doctors', () => doctors.forEach((doctor, i) => list.push({ type: 'doctor', doctor, first: i === 0 })));
    }
    if (key === 'wishes' && wishes.length) {
      once('wishes', () => wishPages.value.forEach((entries, i) => list.push({ type: 'wishes', entries, first: i === 0 })));
    }
  }
  list.push({ type: 'closing' });
  return list.map((p, i) => ({ ...p, n: i + 1 }));
});
const lastIndex = computed(() => pages.value.length - 1);

// ---- Siap cetak ---------------------------------------------------------------
async function loadFonts() {
  if (!document.fonts) return;
  // Muat semua bagian huruf yang dipakai teks buku (mis. "ī", "é" ada di bagian
  // latin-ext), bukan hanya huruf dasar — agar tidak tercetak dengan huruf cadangan.
  const chars = [...new Set((document.querySelector('.k-book')?.textContent || '').replace(/\s+/g, ''))].join('');
  const sample = `abc ${chars}`;
  const faces = [
    '500 16px "Cormorant Garamond"', '600 16px "Cormorant Garamond"', 'italic 400 16px "Cormorant Garamond"',
    '400 16px "Cormorant Garamond"', '300 16px Jost', '400 16px Jost', '500 16px Jost', '400 16px Parisienne',
  ];
  await Promise.all(faces.map((f) => document.fonts.load(f, sample).catch(() => null)));
  await document.fonts.ready;
}

function waitImages() {
  const imgs = [...document.querySelectorAll('.k-book img')];
  return Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth
        ? (img.decode ? img.decode().catch(() => null) : null)
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
    )
  );
}

// Teks yang terlalu panjang untuk satu halaman diperkecil sedikit agar tidak terpotong.
function fitPages() {
  document.querySelectorAll('.k-fit').forEach((fit) => {
    const area = fit.parentElement;
    let zoom = 1;
    fit.style.zoom = '';
    while (zoom > 0.72 && fit.getBoundingClientRect().height > area.getBoundingClientRect().height + 0.5) {
      zoom -= 0.04;
      fit.style.zoom = String(zoom);
    }
  });
}

onMounted(async () => {
  if (!data) {
    window.__KEEPSAKE_READY__ = true;
    return;
  }
  try {
    await loadFonts();
    await nextTick();
    await measureWishes();
    measuring.value = false;
    await nextTick();
    await waitImages();
    fitPages();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  } catch (err) {
    window.__KEEPSAKE_ERROR__ = String(err?.message || err);
  } finally {
    window.__KEEPSAKE_READY__ = true;
  }
});
</script>

<template>
  <p v-if="!data" class="k-notice">{{ texts.keepsakeNotice }}</p>

  <div v-else class="k-book">
    <!-- Area ukur untuk membagi ucapan ke halaman (dihapus sebelum dicetak) -->
    <div v-if="measuring && wishes.length" ref="measureEl" class="k-measure" aria-hidden="true">
      <div data-measure="head" class="k-wishes-head">
        <p class="k-title">{{ texts.keepsakeWishesTitle }}</p>
        <p class="k-label" style="margin-top: 2.4mm">{{ wishesCount }}</p>
        <div class="k-divider"><KStar /></div>
      </div>
      <article v-for="(w, i) in wishes" :key="w.id ?? i" data-measure="wish" class="k-wish" :class="`k-wish--${wishSizes[i]}`">
        <p class="k-wish__msg">{{ w.message }}</p>
        <p class="k-wish__by">
          <span class="k-wish__name">{{ w.guest_name }}</span>
          <span v-if="wishMeta(w)" class="k-wish__meta"> · {{ wishMeta(w) }}</span>
        </p>
      </article>
    </div>

    <section
      v-for="(page, idx) in pages"
      :key="`${page.type}-${page.n}`"
      class="k-page"
      :class="{ 'k-page--tint': page.type === 'cover' || page.type === 'closing' }"
      :data-page="page.type"
    >
      <!-- 1. Sampul -->
      <template v-if="page.type === 'cover'">
        <div class="k-arch">
          <span class="k-arch__apex"><KStar /></span>
          <div class="k-arch__inner">
            <div class="k-ring" style="width: 40mm; height: 40mm">
              <img v-if="coverPhoto" :src="coverPhoto" :alt="nickname" />
              <span v-else class="k-ring__letter" style="font-size: 30pt">{{ site.site.monogram }}</span>
            </div>
            <template v-if="useNickname">
              <p class="k-cover__nick">{{ nickname.toUpperCase() }}</p>
              <p class="k-cover__full">{{ fullName }}</p>
            </template>
            <p v-else class="k-cover__name">{{ fullName }}</p>
            <div class="k-divider"><KStar /></div>
            <p v-if="birthDateShort" class="k-cover__date">{{ birthDateShort }}</p>
          </div>
        </div>
        <p class="k-cover__label">{{ texts.keepsakeCoverLabel }}</p>
      </template>

      <!-- 2. Pembuka -->
      <div v-else-if="page.type === 'opening'" class="k-area k-area--center">
        <div class="k-fit">
          <span class="k-star"><KStar /></span>
          <p v-if="texts.heroScript" class="k-quote" style="margin-top: 6mm; font-size: 16pt; max-width: 100mm">{{ texts.heroScript }}</p>
          <p v-if="texts.heroTagline" class="k-quote" style="margin-top: 4mm; font-size: 12pt; color: rgb(var(--c-ink-muted))">
            {{ texts.heroTagline }}
          </p>
          <div class="k-divider" style="margin-top: 7mm; margin-bottom: 7mm"><KStar /></div>
          <p v-if="texts.heroClosing" class="k-text" style="max-width: 92mm">{{ texts.heroClosing }}</p>
        </div>
      </div>

      <!-- 3. Makna nama -->
      <div v-else-if="page.type === 'names'" class="k-area k-area--center">
        <div class="k-fit">
          <p class="k-title">{{ texts.nameStoryTitle }}</p>
          <div class="k-divider"><KStar /></div>
          <p class="k-name">{{ fullName }}</p>
          <p v-if="texts.nameStoryIntro" class="k-name-intro">{{ texts.nameStoryIntro }}</p>
          <div class="k-parts">
            <div v-for="(item, i) in nameItems" :key="i" class="k-part" :class="{ 'k-part--prayer': !item.part }">
              <template v-if="item.part">
                <p class="k-part__name">{{ item.part }}</p>
                <p class="k-part__text">{{ item.meaning }}</p>
              </template>
              <template v-else>
                <span class="k-star"><KStar /></span>
                <p class="k-quote">{{ item.text }}</p>
              </template>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Cerita orang tua -->
      <div v-else-if="page.type === 'story'" class="k-area k-area--center">
        <div class="k-fit">
          <p v-if="texts.storyTitle" class="k-title" style="margin-bottom: 6mm">{{ texts.storyTitle }}</p>
          <div v-if="storyPhoto" class="k-frame" style="width: 78mm; height: 97.5mm">
            <img :src="storyPhoto" :alt="parentNames" style="object-position: 50% 30%" />
          </div>
          <div v-else-if="familyParents.some((p) => p.photo_url)" style="display: flex; gap: 8mm">
            <div v-for="p in familyParents" :key="p.id" class="k-ring" style="width: 30mm; height: 30mm">
              <img v-if="p.photo_url" :src="p.photo_url" :alt="p.full_name" />
              <span v-else class="k-ring__letter" style="font-size: 18pt">{{ (p.nickname || p.full_name || '?').charAt(0) }}</span>
            </div>
          </div>
          <p v-for="(para, i) in storyParas" :key="i" class="k-quote" :style="{ marginTop: i ? '3mm' : '7mm', maxWidth: '104mm' }">
            {{ para }}
          </p>
          <template v-if="parentNames">
            <p class="k-label" style="margin-top: 6mm">{{ texts.storySignoff }}</p>
            <p class="k-script" style="margin-top: 1mm">{{ parentNames }}</p>
          </template>
        </div>
      </div>

      <!-- 5. Detail kelahiran -->
      <div v-else-if="page.type === 'birth'" class="k-area k-area--center">
        <div class="k-fit">
          <p class="k-title">{{ isBorn ? texts.birthInfoTitleBorn : texts.birthInfoTitleWaiting }}</p>
          <div class="k-divider"><KStar /></div>
          <div class="k-facts">
            <div v-for="f in facts" :key="f.key" class="k-fact">
              <p class="k-label">{{ f.label }}</p>
              <p class="k-fact__value">{{ f.value }}</p>
            </div>
            <div v-if="measures.length" class="k-fact" :class="{ 'k-fact--pair': measures.length === 2 }">
              <div v-for="m in measures" :key="m.key">
                <p class="k-label">{{ m.label }}</p>
                <p class="k-fact__value">{{ m.value }}</p>
              </div>
            </div>
            <div v-if="place" class="k-fact">
              <p class="k-label">{{ texts.birthLabelPlace }}</p>
              <p class="k-fact__value" style="font-size: 15pt">{{ place }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Galeri -->
      <div v-else-if="page.type === 'gallery-first'" class="k-area k-area--center">
        <div class="k-fit">
          <p class="k-title">{{ texts.galleryTitle }}</p>
          <div class="k-divider"><KStar /></div>
          <div class="k-frame" style="width: 96mm; height: 128mm">
            <img :src="page.photo.image_url" :alt="page.photo.alt_text || page.photo.caption || ''" />
          </div>
          <p v-if="page.photo.caption" class="k-caption">{{ page.photo.caption }}</p>
        </div>
      </div>
      <div v-else-if="page.type === 'gallery-grid'" class="k-area k-area--center">
        <div class="k-grid">
          <figure v-for="(photo, i) in page.photos" :key="i" style="margin: 0">
            <div class="k-frame" style="width: 100%; height: 100%">
              <img :src="photo.image_url" :alt="photo.alt_text || photo.caption || ''" />
            </div>
          </figure>
        </div>
      </div>

      <!-- 7. Dokter -->
      <div v-else-if="page.type === 'doctor'" class="k-area k-area--center">
        <div class="k-fit">
          <template v-if="page.first">
            <p class="k-title" style="max-width: 100mm">{{ texts.doctorTitle }}</p>
            <div class="k-divider"><KStar /></div>
          </template>
          <div class="k-ring" style="width: 32mm; height: 32mm">
            <img v-if="page.doctor.photo_url" :src="page.doctor.photo_url" :alt="doctorParts(page.doctor).name" />
            <span v-else class="k-ring__letter" style="font-size: 20pt">{{ doctorParts(page.doctor).name.replace(/^(dr|drg|bd|bidan|ns)\.?\s+/i, '').charAt(0) }}</span>
          </div>
          <p class="k-doctor__name">{{ doctorParts(page.doctor).name }}</p>
          <p v-if="doctorParts(page.doctor).credentials" class="k-doctor__cred">{{ doctorParts(page.doctor).credentials }}</p>
          <div v-if="doctorParts(page.doctor).bio.length" class="k-doctor__bio">
            <p v-for="(para, i) in doctorParts(page.doctor).bio" :key="i" class="k-text">{{ para }}</p>
          </div>
        </div>
      </div>

      <!-- 8. Ucapan -->
      <div v-else-if="page.type === 'wishes'" class="k-area k-wishes">
        <div v-if="page.first" class="k-wishes-head" style="margin-bottom: 5mm">
          <p class="k-title">{{ texts.keepsakeWishesTitle }}</p>
          <p class="k-label" style="margin-top: 2.4mm">{{ wishesCount }}</p>
          <div class="k-divider"><KStar /></div>
        </div>
        <article v-for="(entry, i) in page.entries" :key="i" class="k-wish" :class="`k-wish--${entry.size}`">
          <p class="k-wish__msg">{{ entry.wish.message }}</p>
          <p class="k-wish__by">
            <span class="k-wish__name">{{ entry.wish.guest_name }}</span>
            <span v-if="wishMeta(entry.wish)" class="k-wish__meta"> · {{ wishMeta(entry.wish) }}</span>
          </p>
        </article>
      </div>

      <!-- 9. Penutup -->
      <div v-else-if="page.type === 'closing'" class="k-area k-area--center">
        <div class="k-fit">
          <div class="k-ring" style="width: 26mm; height: 26mm">
            <img v-if="coverPhoto" :src="coverPhoto" :alt="nickname" />
            <span v-else class="k-ring__letter" style="font-size: 20pt">{{ site.site.monogram }}</span>
          </div>
          <p class="k-closing__name">{{ layout.footerName === 'nickname' ? nickname : fullName }}</p>
          <p v-if="parentNames" class="k-script" style="margin-top: 1mm; font-size: 17pt">{{ parentNames }}</p>
          <p v-if="texts.footerThanks" class="k-text" style="margin-top: 6mm; max-width: 90mm">{{ texts.footerThanks }}</p>
          <div class="k-divider" style="margin-top: 7mm"><KStar /></div>
          <p v-if="site.site.footerCredit" class="k-label">{{ site.site.footerCredit }}</p>
          <!-- Alamat website sengaja tidak dicantumkan: buku tetap berarti walau situs sudah tidak aktif. -->
          <p class="k-label" style="margin-top: 1.5mm">{{ madeOn }}</p>
        </div>
      </div>

      <p v-if="page.type !== 'cover' && page.type !== 'closing' && idx !== lastIndex" class="k-folio">{{ page.n }}</p>
    </section>
  </div>
</template>
