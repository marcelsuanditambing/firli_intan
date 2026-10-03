<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { useScrollTo } from '@/composables/useScrollTo.js';
import { formatDate } from '@/utils/format.js';
import { site, texts, sections } from '@/config';
import SectionDivider from '@/components/ui/SectionDivider.vue';

const baby = useBabyStore();
const { scrollToId } = useScrollTo();
const name = computed(() => baby.data?.name || site.baby.fullName);
const dateLabel = computed(() => (baby.data?.birth_date ? formatDate(baby.data.birth_date, { withDay: false }) : ''));
const eyebrow = computed(() => (baby.isBorn ? texts.heroEyebrowBorn : texts.heroEyebrowWaiting));
// Nama panjang diperkecil agar tetap rapi di layar HP.
const nameSize = computed(() =>
  name.value.length > 22 ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-7xl'
);
// Tombol "Geser" menuju bagian pertama yang aktif.
const order = [
  ['profil', sections.profile],
  ['kelahiran', sections.birthInfo],
  ['usia', sections.ageCounter],
  ['cerita', sections.story],
  ['timeline', sections.timeline],
  ['galeri', sections.gallery],
  ['lokasi', sections.location],
  ['ucapan', sections.wishes],
];
const firstSection = (order.find(([, on]) => on) || ['ucapan'])[0];
</script>

<template>
  <section id="hero" class="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
    <!-- ambient soft shapes -->
    <div class="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gold-soft/20 blur-3xl animate-floaty"></div>
    <div class="pointer-events-none absolute bottom-10 -right-12 h-52 w-52 rounded-full bg-blush/30 blur-3xl animate-floaty" style="animation-delay: 1.5s"></div>

    <p v-if="texts.heroScript" class="font-script text-2xl text-gold-deep" v-reveal>{{ texts.heroScript }}</p>
    <p class="eyebrow mt-5" v-reveal="{ delay: 80 }">{{ eyebrow }}</p>

    <h1 class="mt-4 font-display font-semibold leading-none text-ink-soft" :class="nameSize" v-reveal="{ delay: 140 }">
      {{ name }}
    </h1>

    <div class="mt-6 w-full" v-reveal="{ delay: 200 }"><SectionDivider /></div>

    <p v-if="dateLabel" class="mt-6 text-sm uppercase tracking-[0.25em] text-ink-muted" v-reveal="{ delay: 260 }">
      {{ dateLabel }}
    </p>

    <button
      class="group absolute bottom-8 flex flex-col items-center gap-1 text-ink-faint transition-colors hover:text-gold-deep"
      aria-label="Gulir ke bawah"
      @click="scrollToId(firstSection)"
    >
      <span class="text-[0.65rem] uppercase tracking-[0.3em]">{{ texts.heroScrollHint }}</span>
      <svg class="h-5 w-5 animate-nudge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </section>
</template>
