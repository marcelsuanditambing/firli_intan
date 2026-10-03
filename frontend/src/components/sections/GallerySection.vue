<script setup>
import { onMounted, ref, computed } from 'vue';
import { useGalleryStore } from '@/stores/gallery.js';
import { site, texts, t, layout } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonCard from '@/components/ui/SkeletonCard.vue';
import ErrorState from '@/components/ui/ErrorState.vue';

const store = useGalleryStore();
// Rasio bingkai foto (layout.galleryAspect). Kelas ditulis lengkap agar terbaca Tailwind.
const ASPECT = { '4/3': 'aspect-[4/3]', '4/5': 'aspect-[4/5]', '3/4': 'aspect-[3/4]', '1/1': 'aspect-square' };
const aspect = ASPECT[layout.galleryAspect] || ASPECT['4/3'];
const track = ref(null);
const active = ref(0);

onMounted(() => store.fetch());

const count = computed(() => store.items.length);

function scrollToIndex(i) {
  const el = track.value;
  if (!el) return;
  const child = el.children[i];
  if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' });
}
function prev() { scrollToIndex(Math.max(0, active.value - 1)); }
function next() { scrollToIndex(Math.min(count.value - 1, active.value + 1)); }

function onScroll() {
  const el = track.value;
  if (!el) return;
  const i = Math.round(el.scrollLeft / el.clientWidth);
  active.value = Math.min(count.value - 1, Math.max(0, i));
}
</script>

<template>
  <section id="galeri" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.galleryEyebrow" :title="texts.galleryTitle" />

    <div class="mt-10">
      <template v-if="store.loading">
        <SkeletonCard :aspect="aspect" />
      </template>

      <ErrorState v-else-if="store.error" :message="store.error" @retry="store.fetch({}, true)" />

      <p v-else-if="store.isEmpty" class="text-center text-sm text-ink-muted">{{ texts.galleryEmpty }}</p>

      <div v-else class="relative" v-reveal>
        <!-- slider track -->
        <div
          ref="track"
          class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none]"
          style="scrollbar-width:none"
          @scroll.passive="onScroll"
        >
          <figure
            v-for="photo in store.items"
            :key="photo.id"
            class="relative w-full shrink-0 snap-center overflow-hidden rounded-2xl bg-sand shadow-soft"
          >
            <img
              :src="photo.image_url"
              :alt="photo.alt_text || photo.caption || `Foto ${site.baby.nickname}`"
              loading="lazy"
              :class="aspect"
              class="h-full w-full object-cover object-[50%_30%]"
            />
            <figcaption
              v-if="photo.caption"
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 py-3 text-center text-xs text-white"
            >
              {{ photo.caption }}
            </figcaption>
          </figure>
        </div>

        <!-- controls -->
        <button
          v-if="count > 1" class="absolute left-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-gold-deep shadow-soft backdrop-blur transition hover:scale-105"
          :aria-label="texts.ariaPrevPhoto" @click="prev"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>
        </button>
        <button
          v-if="count > 1" class="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-ivory/90 text-gold-deep shadow-soft backdrop-blur transition hover:scale-105"
          :aria-label="texts.ariaNextPhoto" @click="next"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>
        </button>

        <!-- dots -->
        <div v-if="count > 1" class="mt-4 flex justify-center gap-2">
          <button
            v-for="(photo, i) in store.items" :key="photo.id"
            class="h-2 rounded-full transition-all"
            :class="i === active ? 'w-6 bg-gold' : 'w-2 bg-shell'"
            :aria-label="t('ariaGoToPhoto', { i: i + 1 })"
            @click="scrollToIndex(i)"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>
