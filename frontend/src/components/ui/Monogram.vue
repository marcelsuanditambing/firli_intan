<script setup>
// Signature element: huruf monogram (atau foto bulat) dalam cincin tipis + aksen kecil.
// Huruf, foto & warna mengikuti site.config.js (site.monogram, site.monogramPhoto, site.theme).
import { site } from '@/config';

defineProps({ size: { type: Number, default: 96 } });
const letter = site.site.monogram;
const photo = site.site.monogramPhoto || null;
const clipId = `monogram-clip-${Math.random().toString(36).slice(2, 8)}`;
</script>

<template>
  <svg
    :width="size" :height="size" viewBox="0 0 120 120" fill="none"
    xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="photo ? site.baby.nickname : `Monogram ${site.baby.nickname}`"
  >
    <circle cx="60" cy="60" r="54" class="stroke-gold" stroke-width="1" />
    <!-- small laurel ticks -->
    <path d="M60 10 q3 5 0 10 q-3 -5 0 -10Z" class="fill-gold" opacity="0.8" />
    <path d="M60 110 q3 -5 0 -10 q-3 5 0 10Z" class="fill-gold" opacity="0.8" />
    <template v-if="photo">
      <defs><clipPath :id="clipId"><circle cx="60" cy="60" r="40" /></clipPath></defs>
      <circle cx="60" cy="60" r="40" class="fill-sand" />
      <image :href="photo" x="20" y="20" width="80" height="80" preserveAspectRatio="xMidYMid slice" :clip-path="`url(#${clipId})`" />
      <circle cx="60" cy="60" r="40" class="stroke-gold-soft" stroke-width="0.8" />
    </template>
    <template v-else>
      <circle cx="60" cy="60" r="48" class="stroke-gold-soft" stroke-width="0.6" stroke-dasharray="1 4" />
      <text
        x="60" y="78" text-anchor="middle" font-family="'Cormorant Garamond', serif"
        font-size="58" font-weight="600" class="fill-gold-deep"
      >{{ letter }}</text>
    </template>
  </svg>
</template>
