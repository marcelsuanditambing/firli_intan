<script setup>
import { onMounted } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { sections, layout } from '@/config';

import HeroSection from '@/components/sections/HeroSection.vue';
import BabyProfile from '@/components/sections/BabyProfile.vue';
import NameStorySection from '@/components/sections/NameStorySection.vue';
import BirthInfo from '@/components/sections/BirthInfo.vue';
import AgeCounterSection from '@/components/sections/AgeCounterSection.vue';
import StorySection from '@/components/sections/StorySection.vue';
import DoctorSection from '@/components/sections/DoctorSection.vue';
import TimelineSection from '@/components/sections/TimelineSection.vue';
import GallerySection from '@/components/sections/GallerySection.vue';
import StatsSection from '@/components/sections/StatsSection.vue';
import WishesSection from '@/components/sections/WishesSection.vue';
import GiftSection from '@/components/sections/GiftSection.vue';
import LocationSection from '@/components/sections/LocationSection.vue';
import ShareBar from '@/components/sections/ShareBar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const baby = useBabyStore();
onMounted(() => baby.fetch());

// Bagian mana yang tampil (sections) dan urutannya (layout.order) diatur di
// site.config.js. Kartu dokter ikut bagian Lokasi; bila Lokasi dimatikan,
// dokter tampil sebagai bagian tersendiri di posisi 'doctors'.
const COMPONENTS = {
  profile: BabyProfile,
  nameStory: NameStorySection,
  birthInfo: BirthInfo,
  ageCounter: AgeCounterSection,
  story: StorySection,
  timeline: TimelineSection,
  gallery: GallerySection,
  gift: GiftSection,
  location: LocationSection,
  doctors: DoctorSection,
  stats: StatsSection,
  wishes: WishesSection,
  share: ShareBar,
};
const visible = (layout.order || Object.keys(COMPONENTS)).filter((key) => {
  if (!COMPONENTS[key] || !sections[key]) return false;
  if (key === 'doctors' && sections.location) return false; // sudah tampil di Lokasi
  return true;
});

// Latar selang-seling otomatis (ivory / cream) mengikuti urutan, agar dua bagian
// bersebelahan tidak berwarna sama. Statistik + ucapan sengaja satu warna.
// Bila layout.decor.pattern aktif, bagian berlatar cream diberi pola tipis;
// dengan decor.patternAlt bagian putih juga berpola, dalam warna kedua.
const decor = layout.decor || {};
const patterned = decor.pattern === 'geometric';
const TONE = {
  white: ['bg-ivory', patterned && decor.patternAlt && 'bg-pattern bg-pattern-alt'].filter(Boolean).join(' '),
  cream: patterned ? 'bg-pattern' : '',
};
const toneKeys = [];
visible.forEach((key, i) => {
  const prev = toneKeys[i - 1];
  if (key === 'wishes' && visible[i - 1] === 'stats') toneKeys.push(prev);
  else toneKeys.push(prev === 'white' ? 'cream' : 'white');
});
const tones = toneKeys.map((k) => TONE[k]);
</script>

<template>
  <div>
    <HeroSection />
    <div v-for="(key, i) in visible" :key="key" :class="tones[i]">
      <component :is="COMPONENTS[key]" />
    </div>
    <AppFooter />
  </div>
</template>
