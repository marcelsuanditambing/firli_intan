<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { formatDate, formatTime, formatWeight, formatLength } from '@/utils/format.js';
import { site, texts, layout } from '@/config';
import BaseButton from '@/components/ui/BaseButton.vue';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';

const baby = useBabyStore();
const d = computed(() => baby.data || {});
const headingTitle = computed(() => (baby.isBorn ? texts.birthInfoTitleBorn : texts.birthInfoTitleWaiting));

const facts = computed(() => [
  { icon: 'calendar', label: texts.birthLabelDate, value: formatDate(d.value.birth_date) },
  { icon: 'clock', label: texts.birthLabelTime, value: formatTime(d.value.birth_time) },
  { icon: 'weight', label: texts.birthLabelWeight, value: formatWeight(d.value.weight_grams) },
  { icon: 'ruler', label: texts.birthLabelLength, value: formatLength(d.value.length_cm) },
  { icon: 'pin', label: texts.birthLabelPlace, value: [d.value.birth_place, d.value.birth_city].filter(Boolean).join(', ') },
].filter((f) => f.value));

// Alamat lengkap tempat lahir + peta (site.config.js: baby.birth.address, layout.birthMap)
const address = site.baby.birthAddress || '';
const mapQuery = computed(() =>
  [d.value.birth_place, address || d.value.birth_city].filter(Boolean).join(', ')
);
const showMap = computed(() => layout.birthMap && !!mapQuery.value);
const mapsEmbed = computed(() => `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&z=16&output=embed`);
const mapsLink = computed(() => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery.value)}`);

// Kartu tanpa pasangan (jumlah ganjil, mis. mode penantian) dibuat selebar penuh.
const fullWidth = computed(() => {
  const set = new Set(facts.value.filter((f) => f.icon === 'pin').map((f) => f.label));
  const grid = facts.value.filter((f) => f.icon !== 'pin');
  if (grid.length % 2 === 1) set.add(grid[grid.length - 1].label);
  return set;
});
</script>

<template>
  <section id="kelahiran" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.birthInfoEyebrow" :title="headingTitle" />

    <div class="mx-auto mt-10 max-w-sm">
      <template v-if="baby.loading">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="rounded-2xl surface p-5">
            <SkeletonLine width="40%" height="0.7rem" />
            <div class="mt-3"><SkeletonLine width="80%" height="1.1rem" /></div>
          </div>
        </div>
      </template>

      <ul v-else class="grid grid-cols-2 gap-4">
        <li
          v-for="(f, i) in facts"
          :key="f.label"
          v-reveal="{ delay: i * 70 }"
          class="rounded-2xl border border-shell/70 surface p-5 text-center"
          :class="{ 'col-span-2': fullWidth.has(f.label) }"
        >
          <p class="eyebrow text-[0.6rem]">{{ f.label }}</p>
          <p class="mt-2 font-display text-xl text-ink-soft">{{ f.value }}</p>
          <p v-if="f.icon === 'pin' && address" class="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-ink-muted">{{ address }}</p>
        </li>
      </ul>

      <div v-if="!baby.loading && showMap" class="mt-6 text-center" v-reveal="{ delay: 120 }">
        <div class="overflow-hidden rounded-2xl border border-shell bg-sand shadow-soft">
          <iframe
            :src="mapsEmbed"
            class="h-56 w-full"
            style="border:0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :title="texts.ariaMap"
          ></iframe>
        </div>
        <a :href="mapsLink" target="_blank" rel="noopener" class="mt-6 inline-block">
          <BaseButton variant="outline">{{ texts.mapsButton }}</BaseButton>
        </a>
      </div>
    </div>
  </section>
</template>
