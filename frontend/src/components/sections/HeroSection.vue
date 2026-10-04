<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { useUiStore } from '@/stores/ui.js';
import { useScrollTo } from '@/composables/useScrollTo.js';
import { formatDate } from '@/utils/format.js';
import { site, texts, sections, layout } from '@/config';
import SectionDivider from '@/components/ui/SectionDivider.vue';

const baby = useBabyStore();
const { scrollToId } = useScrollTo();
const name = computed(() => baby.data?.name || site.baby.fullName);
const dateLabel = computed(() => (baby.data?.birth_date ? formatDate(baby.data.birth_date, { withDay: false }) : ''));
const eyebrow = computed(() => (baby.isBorn ? texts.heroEyebrowBorn : texts.heroEyebrowWaiting));
// Nama panjang diperkecil agar tetap rapi di layar HP.
const nameSize = computed(() => {
  if (layout.decor?.heroFrame === 'arch') return name.value.length > 22 ? 'text-[2.6rem] leading-[1.05]' : 'text-5xl';
  return name.value.length > 22 ? 'text-5xl sm:text-6xl' : 'text-6xl sm:text-7xl';
});
// Kalimat pembuka pendek memakai huruf script; kalimat panjang memakai serif miring agar terbaca.
const scriptIsLong = (texts.heroScript || '').length > 32;
const photo = layout.heroPhoto ? site.baby.profilePhoto : null;
// Dekorasi (layout.decor): pola latar, bingkai lengkung, kilau foil pada nama.
const decor = layout.decor || {};
const ui = useUiStore(); // kilau nama diputar setelah layar pembuka ditutup
const arch = decor.heroFrame === 'arch';

// Tombol "Geser" menuju bagian pertama yang aktif (mengikuti layout.order).
const SECTION_ID = {
  profile: 'profil', nameStory: 'makna-nama', birthInfo: 'kelahiran', ageCounter: 'usia', story: 'cerita',
  timeline: 'timeline', gallery: 'galeri', gift: 'gift', location: 'lokasi', doctors: 'dokter',
  stats: 'statistik', wishes: 'ucapan', share: 'bagikan',
};
const firstKey = (layout.order || []).find((k) => sections[k]);
const firstSection = SECTION_ID[firstKey] || 'ucapan';
</script>

<template>
  <section
    id="hero"
    class="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 pb-28 text-center"
    :class="[arch ? 'pt-14' : 'pt-20', { 'bg-pattern': decor.pattern === 'geometric' }]"
  >
    <!-- ambient soft shapes -->
    <div class="pointer-events-none absolute -top-10 -left-10 h-44 w-44 rounded-full bg-gold-soft/20 blur-3xl animate-floaty"></div>
    <div class="pointer-events-none absolute bottom-10 -right-12 h-52 w-52 rounded-full bg-blush/30 blur-3xl animate-floaty" style="animation-delay: 1.5s"></div>

    <div :class="arch ? 'arch-frame flex w-full max-w-[22rem] flex-col items-center px-7 pb-12 pt-24' : 'contents'">
    <span v-if="arch" class="arch-apex" aria-hidden="true">&#10022;</span>
    <p
      v-if="texts.heroScript"
      class="max-w-xs text-gold-deep"
      :class="scriptIsLong ? 'font-display text-xl italic leading-snug' : 'font-script text-2xl'"
      v-reveal
    >
      {{ texts.heroScript }}
    </p>
    <p v-if="eyebrow" class="eyebrow mt-5" v-reveal="{ delay: 80 }">{{ eyebrow }}</p>

    <h1
      class="font-display font-semibold leading-none text-ink-soft"
      :class="[nameSize, eyebrow ? 'mt-4' : 'mt-6', { 'text-foil': decor.foilName, 'foil-play': decor.foilName && !ui.splashOpen }]"
      v-reveal="{ delay: 140 }"
    >
      {{ name }}
    </h1>

    <p v-if="texts.heroTagline" class="mt-5 max-w-xs font-display text-lg italic leading-snug text-ink-muted" v-reveal="{ delay: 180 }">
      {{ texts.heroTagline }}
    </p>

    <div class="mt-6 w-full" v-reveal="{ delay: 200 }"><SectionDivider /></div>

    <p v-if="dateLabel" class="mt-6 text-sm uppercase tracking-[0.25em] text-ink-muted" v-reveal="{ delay: 260 }">
      <template v-if="texts.heroDatePrefix">{{ texts.heroDatePrefix }} · </template>{{ dateLabel }}
    </p>

    <div
      v-if="photo"
      class="mx-auto mt-8 h-40 w-40 overflow-hidden rounded-full border border-gold-soft/60 bg-sand shadow-card"
      v-reveal="{ delay: 300 }"
    >
      <img :src="photo" :alt="name" class="h-full w-full object-cover" />
    </div>

    <p v-if="texts.heroClosing" class="mt-8 max-w-xs text-[0.95rem] leading-relaxed text-ink-muted" v-reveal="{ delay: 320 }">
      {{ texts.heroClosing }}
    </p>
    </div>

    <button
      class="group absolute bottom-8 flex flex-col items-center gap-1 text-ink-faint transition-colors hover:text-gold-deep"
      :aria-label="texts.ariaScrollDown"
      @click="scrollToId(firstSection)"
    >
      <span class="text-[0.65rem] uppercase tracking-[0.3em]">{{ texts.heroScrollHint }}</span>
      <svg class="h-5 w-5 animate-nudge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M6 9l6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </section>
</template>
