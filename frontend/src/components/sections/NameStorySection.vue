<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { site, texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';

// Makna nama sebagai bagian tersendiri.
// baby.nameMeaning: { part, meaning } = kartu per kata, { text } = paragraf/doa.
const baby = useBabyStore();
const fullName = computed(() => baby.data?.name || site.baby.fullName);
const items = site.baby.nameMeaning || [];
</script>

<template>
  <section v-if="items.length" id="makna-nama" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.nameStoryEyebrow" :title="texts.nameStoryTitle" />

    <div class="mx-auto mt-10 max-w-md text-center">
      <p class="font-display text-3xl font-medium leading-tight text-ink-soft" v-reveal>{{ fullName }}</p>
      <p v-if="texts.nameStoryIntro" class="mt-3 font-display text-lg italic text-ink-muted" v-reveal="{ delay: 80 }">
        {{ texts.nameStoryIntro }}
      </p>

      <div class="mt-10 space-y-4 text-left">
        <template v-for="(item, i) in items" :key="i">
          <div
            v-if="item.part"
            class="rounded-2xl border border-shell/70 surface p-5"
            v-reveal="{ delay: (i % 4) * 70 }"
          >
            <p class="font-display text-2xl text-gold-deep">{{ item.part }}</p>
            <p class="mt-1.5 text-sm leading-relaxed text-ink-muted">{{ item.meaning }}</p>
          </div>
          <blockquote
            v-else
            class="px-2 py-4 text-center font-display text-lg italic leading-relaxed text-ink-soft"
            v-reveal="{ delay: (i % 4) * 70 }"
          >
            <span class="mx-auto mb-3 block w-fit text-xs not-italic tracking-widest text-gold" aria-hidden="true">&#10022;</span>
            {{ item.text }}
          </blockquote>
        </template>
      </div>
    </div>
  </section>
</template>
