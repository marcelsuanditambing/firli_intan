<script setup>
// Signature element: huruf monogram dalam cincin tipis + aksen kecil.
// Huruf & warna mengikuti site.config.js (site.monogram & site.theme).
import { site } from '@/config';

defineProps({ size: { type: Number, default: 96 } });
const letter = site.site.monogram;
</script>

<template>
  <svg
    :width="size" :height="size" viewBox="0 0 120 120" fill="none"
    xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="`Monogram ${site.baby.nickname}`"
  >
    <circle cx="60" cy="60" r="54" class="stroke-gold" stroke-width="1" />
    <circle cx="60" cy="60" r="48" class="stroke-gold-soft" stroke-width="0.6" stroke-dasharray="1 4" />
    <!-- small laurel ticks -->
    <path d="M60 10 q3 5 0 10 q-3 -5 0 -10Z" class="fill-gold" opacity="0.8" />
    <path d="M60 110 q3 -5 0 -10 q-3 5 0 10Z" class="fill-gold" opacity="0.8" />
    <text
      x="60" y="78" text-anchor="middle" font-family="'Cormorant Garamond', serif"
      font-size="58" font-weight="600" class="fill-gold-deep"
    >{{ letter }}</text>
  </svg>
</template>
