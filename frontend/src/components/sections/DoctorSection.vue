<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';

const baby = useBabyStore();
const doctors = computed(() => baby.doctors);
</script>

<template>
  <section v-if="doctors.length" id="dokter" class="bg-ivory px-6 py-20">
    <SectionHeading :eyebrow="texts.doctorEyebrow" :title="texts.doctorTitle" />

    <div class="mx-auto mt-10 flex max-w-sm flex-col gap-6">
      <div
        v-for="(doc, i) in doctors"
        :key="doc.id"
        v-reveal="{ delay: i * 90 }"
        class="flex items-center gap-5 rounded-2xl border border-gold-soft/40 bg-cream p-5 shadow-soft"
      >
        <div class="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gold-soft/60 bg-sand">
          <img
            v-if="doc.photo_url"
            :src="doc.photo_url"
            :alt="`Foto ${doc.full_name}`"
            class="h-full w-full object-cover"
            loading="lazy"
          />
          <div v-else class="flex h-full w-full items-center justify-center font-script text-3xl text-gold-deep/70">
            {{ doc.full_name.charAt(0) }}
          </div>
        </div>
        <div class="min-w-0">
          <p class="font-display text-xl leading-tight text-ink-soft">{{ doc.full_name }}</p>
          <p v-if="doc.nickname" class="text-xs uppercase tracking-[0.18em] text-gold-deep">{{ doc.nickname }}</p>
          <p v-if="doc.bio" class="mt-1 text-sm leading-relaxed text-ink-muted">{{ doc.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
