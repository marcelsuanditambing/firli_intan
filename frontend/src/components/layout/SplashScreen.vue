<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { site, texts } from '@/config';
import Monogram from '@/components/ui/Monogram.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const baby = useBabyStore();
const name = computed(() => baby.data?.name || site.baby.fullName);
defineEmits(['open']);
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream px-8 text-center">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-blush/15 via-transparent to-gold-soft/10"></div>

    <div class="relative flex flex-col items-center">
      <div class="animate-floaty"><Monogram :size="104" /></div>

      <p class="mt-8 font-script text-2xl text-gold-deep">{{ texts.splashEyebrow }}</p>
      <h1 class="mt-2 font-display font-semibold text-ink-soft" :class="name.length > 16 ? 'text-4xl' : 'text-5xl'">{{ name }}</h1>

      <div class="mt-6 flex items-center gap-3">
        <span class="h-px w-10 bg-gradient-to-r from-transparent to-gold-soft"></span>
        <span class="text-gold text-xs">&#10022;</span>
        <span class="h-px w-10 bg-gradient-to-l from-transparent to-gold-soft"></span>
      </div>

      <p class="mt-8 max-w-xs text-sm leading-relaxed text-ink-muted">{{ texts.splashIntro }}</p>

      <div class="mt-8">
        <BaseButton @click="$emit('open')">{{ texts.splashButton }}</BaseButton>
      </div>
    </div>
  </div>
</template>
