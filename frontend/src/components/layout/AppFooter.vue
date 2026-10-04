<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { site, texts, layout } from '@/config';
import Monogram from '@/components/ui/Monogram.vue';

const baby = useBabyStore();
// layout.footerName: 'full' = nama lengkap, 'nickname' = nama panggilan
const name = computed(() =>
  layout.footerName === 'nickname' ? site.baby.nickname : baby.data?.name || site.baby.fullName
);
const parents = computed(() => baby.familyParents);
const year = new Date().getFullYear();
const credit = site.site.footerCredit;
// Kredit panjang ditaruh di baris sendiri agar tidak terpotong di tengah kata.
const creditOwnLine = (credit || '').length > 24;
</script>

<template>
  <footer class="bg-cream px-6 py-16 text-center" :class="{ 'bg-pattern': layout.decor?.pattern === 'geometric' }">
    <div class="flex justify-center" v-reveal><Monogram :size="72" /></div>
    <p class="mt-6 font-display text-3xl text-ink-soft">{{ name }}</p>
    <p v-if="parents.length" class="mt-2 font-script text-xl text-gold-deep">
      {{ parents.map((p) => p.nickname || p.full_name).join(' & ') }}
    </p>
    <p class="mx-auto mt-6 max-w-xs text-sm leading-relaxed text-ink-muted">{{ texts.footerThanks }}</p>
    <p class="mt-8 text-[0.65rem] uppercase tracking-[0.25em] text-ink-faint">
      &copy; {{ year }}<template v-if="credit && !creditOwnLine"> · {{ credit }}</template>
      <span v-if="credit && creditOwnLine" class="mt-2 block">{{ credit }}</span>
    </p>
  </footer>
</template>
