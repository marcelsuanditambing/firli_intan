<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import DoctorCard from '@/components/ui/DoctorCard.vue';

const baby = useBabyStore();
const doctors = computed(() => baby.doctors);
</script>

<template>
  <section v-if="doctors.length" id="dokter" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.doctorEyebrow" :title="texts.doctorTitle" />

    <div class="mx-auto mt-10 flex max-w-sm flex-col gap-6">
      <DoctorCard v-for="(doc, i) in doctors" :key="doc.id" :doctor="doc" v-reveal="{ delay: i * 90 }" />
    </div>
  </section>
</template>
