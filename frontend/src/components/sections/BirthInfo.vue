<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { formatDate, formatTime, formatWeight, formatLength } from '@/utils/format.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';

const baby = useBabyStore();
const d = computed(() => baby.data || {});
const headingTitle = computed(() => (baby.isBorn ? texts.birthInfoTitleBorn : texts.birthInfoTitleWaiting));

const facts = computed(() => [
  { icon: 'calendar', label: 'Tanggal', value: formatDate(d.value.birth_date) },
  { icon: 'clock', label: 'Waktu', value: formatTime(d.value.birth_time) },
  { icon: 'weight', label: 'Berat', value: formatWeight(d.value.weight_grams) },
  { icon: 'ruler', label: 'Panjang', value: formatLength(d.value.length_cm) },
  { icon: 'pin', label: 'Lokasi', value: [d.value.birth_place, d.value.birth_city].filter(Boolean).join(', ') },
].filter((f) => f.value));

// Kartu tanpa pasangan (jumlah ganjil, mis. mode penantian) dibuat selebar penuh.
const fullWidth = computed(() => {
  const set = new Set(facts.value.filter((f) => f.icon === 'pin').map((f) => f.label));
  const grid = facts.value.filter((f) => f.icon !== 'pin');
  if (grid.length % 2 === 1) set.add(grid[grid.length - 1].label);
  return set;
});
</script>

<template>
  <section id="kelahiran" class="bg-ivory px-6 py-20">
    <SectionHeading :eyebrow="texts.birthInfoEyebrow" :title="headingTitle" />

    <div class="mx-auto mt-10 max-w-sm">
      <template v-if="baby.loading">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="i in 4" :key="i" class="rounded-2xl bg-cream p-5">
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
          class="rounded-2xl border border-shell/70 bg-cream p-5 text-center"
          :class="{ 'col-span-2': fullWidth.has(f.label) }"
        >
          <p class="eyebrow text-[0.6rem]">{{ f.label }}</p>
          <p class="mt-2 font-display text-xl text-ink-soft">{{ f.value }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
