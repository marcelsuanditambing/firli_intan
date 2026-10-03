<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { useBabyAge } from '@/composables/useBabyAge.js';
import { formatDate } from '@/utils/format.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';

const baby = useBabyStore();
const { age, isFuture } = useBabyAge(() => baby.data?.birth_date, () => baby.data?.birth_time);

// Mode mengikuti status kelahiran (site.config.js -> baby.status), bukan sekadar tanggal:
// - penantian & tanggal belum lewat -> hitung mundur
// - penantian & tanggal sudah lewat -> angka 0 + catatan "segera hadir"
// - sudah lahir -> usia berjalan
const waiting = computed(() => !baby.isBorn);
const overdue = computed(() => waiting.value && !isFuture.value);

const eyebrow = computed(() => (waiting.value ? texts.ageEyebrowWaiting : texts.ageEyebrowBorn));
const title = computed(() => (waiting.value ? texts.ageTitleWaiting : texts.ageTitleBorn));
const subtitle = computed(() => (waiting.value ? texts.ageSubtitleWaiting : texts.ageSubtitleBorn));
const dateLabel = computed(() => (baby.data?.birth_date ? formatDate(baby.data.birth_date) : ''));

const shown = computed(() => (overdue.value || (!waiting.value && isFuture.value) ? { days: 0, hours: 0, minutes: 0, seconds: 0 } : age.value));
const units = computed(() => [
  { key: 'd', label: texts.unitDays, value: shown.value.days },
  { key: 'h', label: texts.unitHours, value: shown.value.hours },
  { key: 'm', label: texts.unitMinutes, value: shown.value.minutes },
  { key: 's', label: texts.unitSeconds, value: shown.value.seconds },
]);
const pad = (n) => String(n).padStart(2, '0');
</script>

<template>
  <section id="usia" class="px-6 py-20">
    <SectionHeading :eyebrow="eyebrow" :title="title" />

    <p v-if="subtitle" class="mx-auto mt-5 max-w-xs text-center font-display text-lg italic text-ink-muted" v-reveal="{ delay: 160 }">
      {{ subtitle }}
    </p>

    <div class="mx-auto mt-8 grid max-w-sm grid-cols-4 gap-3" v-reveal>
      <div
        v-for="u in units" :key="u.key"
        class="rounded-2xl border border-gold-soft/40 surface py-4 text-center shadow-soft"
      >
        <p class="font-display text-3xl font-medium tabular-nums lining-nums text-ink-soft">
          {{ u.key === 'd' ? u.value : pad(u.value) }}
        </p>
        <p class="mt-1 text-[0.58rem] uppercase tracking-[0.16em] text-ink-muted">{{ u.label }}</p>
      </div>
    </div>

    <p v-if="overdue" class="mt-6 text-center text-sm text-gold-deep" v-reveal="{ delay: 120 }">
      {{ texts.ageOverdueNote }}
    </p>
    <p v-else-if="waiting && dateLabel && texts.ageWaitingNote" class="mt-6 text-center text-sm text-ink-muted" v-reveal="{ delay: 120 }">
      {{ texts.ageWaitingNote }} <span class="text-gold-deep">{{ dateLabel }}</span>
    </p>
  </section>
</template>
