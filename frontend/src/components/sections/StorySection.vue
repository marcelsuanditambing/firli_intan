<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';

const baby = useBabyStore();
const parents = computed(() => baby.familyParents);
const story = computed(() => baby.data?.description || '');
</script>

<template>
  <section id="cerita" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.storyEyebrow" :title="texts.storyTitle" />

    <div class="mx-auto mt-10 max-w-md text-center">
      <template v-if="baby.loading">
        <div class="space-y-3">
          <SkeletonLine /><SkeletonLine width="92%" /><SkeletonLine width="80%" />
        </div>
      </template>
      <template v-else>
        <svg class="mx-auto mb-4 h-7 w-7 text-gold-soft" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 7h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2H7V7zm8 0h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2h-2V7z" />
        </svg>
        <p class="font-display text-xl italic leading-relaxed text-ink-soft" v-reveal>
          {{ story || texts.storyFallback }}
        </p>

        <div v-if="parents.length" class="mt-10" v-reveal="{ delay: 120 }">
          <div class="flex items-start justify-center gap-8">
            <figure v-for="p in parents" :key="p.id" class="flex flex-col items-center">
              <div class="h-24 w-24 overflow-hidden rounded-full border border-gold-soft/60 bg-sand shadow-card">
                <img
                  v-if="p.photo_url"
                  :src="p.photo_url"
                  :alt="p.full_name"
                  loading="lazy"
                  class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full w-full items-center justify-center font-script text-3xl text-gold-deep/70">
                  {{ (p.nickname || p.full_name || '?').charAt(0) }}
                </div>
              </div>
              <figcaption class="mt-3 font-display text-lg text-ink-soft">{{ p.nickname }}</figcaption>
              <p class="max-w-[9rem] text-xs leading-snug text-ink-muted">{{ p.full_name }}</p>
            </figure>
          </div>

          <p class="eyebrow mt-8 text-[0.6rem]">{{ texts.storySignoff }}</p>
          <p class="mt-2 font-script text-2xl text-gold-deep">
            {{ parents.map((p) => p.nickname || p.full_name).join(' & ') }}
          </p>
        </div>
      </template>
    </div>
  </section>
</template>
