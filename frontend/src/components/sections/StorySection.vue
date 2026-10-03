<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { texts, layout, paragraphs } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';

const baby = useBabyStore();
const parents = computed(() => baby.familyParents);
// texts.storyQuote (bila diisi) menggantikan deskripsi bayi di bagian ini.
const story = computed(() => paragraphs(texts.storyQuote || baby.data?.description || texts.storyFallback));
// layout.storyPhoto: satu foto orang tua berdua menggantikan foto bulat masing-masing.
const couplePhoto = layout.storyPhoto;
const names = computed(() => parents.value.map((p) => p.nickname || p.full_name).join(' & '));
const hasHeading = !!(texts.storyTitle || texts.storyEyebrow);
</script>

<template>
  <section id="cerita" class="px-6 py-20">
    <SectionHeading v-if="hasHeading" :eyebrow="texts.storyEyebrow" :title="texts.storyTitle" />

    <div class="mx-auto max-w-md text-center" :class="hasHeading ? 'mt-10' : ''">
      <template v-if="baby.loading && !texts.storyQuote">
        <div class="space-y-3">
          <SkeletonLine /><SkeletonLine width="92%" /><SkeletonLine width="80%" />
        </div>
      </template>
      <template v-else>
        <svg class="mx-auto mb-4 h-7 w-7 text-gold-soft" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 7h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2H7V7zm8 0h4v4c0 2.2-1.8 4-4 4v-2c1.1 0 2-.9 2-2h-2V7z" />
        </svg>
        <p
          v-for="(para, i) in story"
          :key="i"
          class="font-display text-xl italic leading-relaxed text-ink-soft"
          :class="i ? 'mt-4' : ''"
          v-reveal="{ delay: i * 80 }"
        >
          {{ para }}
        </p>

        <!-- Satu foto berdua -->
        <figure v-if="couplePhoto" class="mt-10" v-reveal="{ delay: 120 }">
          <div class="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[1.75rem] border border-gold-soft/60 bg-sand p-1.5 shadow-card">
            <img
              :src="couplePhoto"
              :alt="names"
              loading="lazy"
              class="aspect-[4/5] w-full rounded-[1.4rem] object-cover object-[50%_30%]"
            />
          </div>
        </figure>

        <!-- Foto bulat masing-masing (gaya Filo) -->
        <div v-else-if="parents.length" class="mt-10 flex items-start justify-center gap-8" v-reveal="{ delay: 120 }">
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
            <p v-if="p.full_name !== p.nickname" class="max-w-[9rem] text-xs leading-snug text-ink-muted">{{ p.full_name }}</p>
          </figure>
        </div>

        <div v-if="parents.length" class="mt-8" v-reveal="{ delay: 160 }">
          <p class="eyebrow text-[0.6rem]">{{ texts.storySignoff }}</p>
          <p class="mt-2 font-script text-3xl text-gold-deep">{{ names }}</p>
        </div>
      </template>
    </div>
  </section>
</template>
