<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { site, texts, layout } from '@/config';
import Monogram from '@/components/ui/Monogram.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionDivider from '@/components/ui/SectionDivider.vue';

const baby = useBabyStore();
// layout.splashName: 'full' = nama lengkap, 'nickname' = nama panggilan huruf kapital
const isNickname = layout.splashName === 'nickname';
const name = computed(() =>
  isNickname ? site.baby.nickname.toUpperCase() : baby.data?.name || site.baby.fullName
);
const nameClass = computed(() => {
  if (isNickname) return 'text-6xl tracking-[0.18em] pl-[0.18em]';
  return name.value.length > 16 ? 'text-4xl' : 'text-5xl';
});
// layout.splashTextFirst: kalimat pembuka di atas nama
const textFirst = !!layout.splashTextFirst;
defineEmits(['open']);
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-y-auto bg-cream px-8 py-10 text-center">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-blush/15 via-transparent to-gold-soft/10"></div>

    <div class="relative flex max-w-sm flex-col items-center">
      <div class="animate-floaty"><Monogram :size="104" /></div>

      <template v-if="textFirst">
        <p v-if="texts.splashEyebrow" class="mt-8 font-script text-2xl text-gold-deep">{{ texts.splashEyebrow }}</p>
        <p class="max-w-xs text-[0.95rem] leading-relaxed text-ink-muted" :class="texts.splashEyebrow ? 'mt-4' : 'mt-8'">
          {{ texts.splashIntro }}
        </p>
        <div class="mt-6 w-full"><SectionDivider /></div>
        <h1 class="mt-5 font-display font-semibold leading-none text-ink-soft" :class="nameClass">{{ name }}</h1>
      </template>

      <template v-else>
        <p v-if="texts.splashEyebrow" class="mt-8 font-script text-2xl text-gold-deep">{{ texts.splashEyebrow }}</p>
        <h1 class="font-display font-semibold text-ink-soft" :class="[nameClass, texts.splashEyebrow ? 'mt-2' : 'mt-8']">{{ name }}</h1>
        <div class="mt-6 w-full"><SectionDivider /></div>
        <p class="mt-8 max-w-xs text-sm leading-relaxed text-ink-muted">{{ texts.splashIntro }}</p>
      </template>

      <div class="mt-10">
        <BaseButton @click="$emit('open')">{{ texts.splashButton }}</BaseButton>
      </div>
    </div>
  </div>
</template>
