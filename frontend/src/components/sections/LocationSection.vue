<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { site, texts, sections } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import BaseButton from '@/components/ui/BaseButton.vue';
import DoctorCard from '@/components/ui/DoctorCard.vue';

const baby = useBabyStore();

// Lokasi saat ini — diisi dari site.config.js (bagian "location").
const current = site.location;

const doctors = computed(() => (sections.doctors ? baby.doctors : []));
const place = computed(() => baby.data?.birth_place || '');
const hasLocation = !!current.address;
const mapsEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(current.address)}&z=16&output=embed`;
const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(current.address)}`;
</script>

<template>
  <section v-if="hasLocation || doctors.length" id="lokasi" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.locationEyebrow" :title="hasLocation ? current.title : texts.doctorTitle" />

    <div class="mx-auto mt-10 max-w-md text-center" v-reveal>
      <template v-if="hasLocation">
        <p v-if="current.name" class="font-display text-2xl text-ink-soft">{{ current.name }}</p>
        <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ current.address }}</p>

        <div v-if="current.note" class="mx-auto mt-6 max-w-xs rounded-2xl border border-gold-soft/40 surface p-5 text-center shadow-soft">
          <p class="text-sm leading-relaxed text-ink-muted">{{ current.note }}</p>
        </div>

        <p v-if="place" class="mt-4 text-xs italic text-ink-faint">{{ texts.bornAtPrefix }} {{ place }}</p>

        <div class="mt-6 overflow-hidden rounded-2xl border border-shell shadow-soft">
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
      </template>

      <!-- Dokter yang menangani -->
      <div
        v-if="doctors.length"
        :class="hasLocation ? 'mt-10 border-t border-shell/70 pt-10' : ''"
        v-reveal="{ delay: 100 }"
      >
        <p v-if="hasLocation" class="eyebrow text-[0.7rem]">{{ texts.doctorsLabel }}</p>
        <DoctorCard v-for="doc in doctors" :key="doc.id" :doctor="doc" class="mt-5" />
      </div>
    </div>
  </section>
</template>
