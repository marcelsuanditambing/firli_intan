<script setup>
import { onMounted, ref, watch, computed } from 'vue';
import { useStatsStore } from '@/stores/stats.js';
import { useCountUp } from '@/composables/useCountUp.js';
import { texts, sections } from '@/config';
import SectionDivider from '@/components/ui/SectionDivider.vue';

const stats = useStatsStore();
const root = ref(null);

const visitorsCounter = useCountUp();
const wishesCounter = useCountUp();

const visitors = computed(() => stats.data?.unique_visitors ?? stats.data?.visits ?? 0);
const wishes = computed(() => stats.data?.wishes_approved ?? 0);

onMounted(async () => {
  await stats.fetch();
  // Trigger count-up when section scrolls into view.
  if (typeof IntersectionObserver !== 'undefined' && root.value) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          visitorsCounter.run(visitors.value);
          wishesCounter.run(wishes.value);
          obs.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(root.value);
  } else {
    visitorsCounter.value = visitors.value;
    wishesCounter.value = wishes.value;
  }
});

// If data arrives after observer fired, keep values correct.
watch(visitors, (v) => { if (visitorsCounter.value === 0) visitorsCounter.value = v; });
</script>

<template>
  <section ref="root" class="bg-ivory px-6 py-16">
    <div class="mx-auto grid max-w-sm gap-6 text-center" :class="sections.wishes ? 'grid-cols-2' : 'grid-cols-1'">
      <div v-reveal>
        <p class="font-display text-5xl font-semibold tabular-nums text-gold-deep">{{ visitorsCounter.value }}</p>
        <p class="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-ink-muted">{{ texts.statsVisitors }}</p>
      </div>
      <div v-if="sections.wishes" v-reveal="{ delay: 100 }">
        <p class="font-display text-5xl font-semibold tabular-nums text-gold-deep">{{ wishesCounter.value }}</p>
        <p class="mt-2 text-[0.65rem] uppercase tracking-[0.22em] text-ink-muted">{{ texts.statsWishes }}</p>
      </div>
    </div>
    <div class="mt-10"><SectionDivider /></div>
  </section>
</template>
