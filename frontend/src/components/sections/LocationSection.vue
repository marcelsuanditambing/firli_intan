<script setup>
import { computed } from 'vue';
import { useBabyStore } from '@/stores/baby.js';
import { site, texts, sections } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

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
  <section v-if="hasLocation || doctors.length" id="lokasi" class="bg-ivory px-6 py-20">
    <SectionHeading :eyebrow="texts.locationEyebrow" :title="hasLocation ? current.title : texts.doctorTitle" />

    <div class="mx-auto mt-10 max-w-md text-center" v-reveal>
      <template v-if="hasLocation">
        <p v-if="current.name" class="font-display text-2xl text-ink-soft">{{ current.name }}</p>
        <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ current.address }}</p>

        <div v-if="current.note" class="mx-auto mt-6 max-w-xs rounded-2xl border border-gold-soft/40 bg-ivory p-5 text-center shadow-soft">
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
            :title="`Peta ${current.title}`"
          ></iframe>
        </div>

        <a :href="mapsLink" target="_blank" rel="noopener" class="mt-6 inline-block">
          <BaseButton variant="outline">Buka di Google Maps</BaseButton>
        </a>
      </template>

      <!-- Dokter yang menangani -->
      <div
        v-if="doctors.length"
        :class="hasLocation ? 'mt-10 border-t border-shell/70 pt-10' : ''"
        v-reveal="{ delay: 100 }"
      >
        <p v-if="hasLocation" class="eyebrow text-[0.7rem]">{{ texts.doctorsLabel }}</p>
        <div
          v-for="doc in doctors"
          :key="doc.id"
          class="mt-5 flex items-center gap-5 rounded-2xl border border-gold-soft/40 bg-cream p-5 text-left shadow-soft"
        >
          <div class="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-gold-soft/60 bg-sand">
            <img
              v-if="doc.photo_url"
              :src="doc.photo_url"
              :alt="doc.full_name"
              loading="lazy"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full w-full items-center justify-center font-script text-3xl text-gold-deep/70">
              {{ (doc.full_name || 'd').charAt(0) }}
            </div>
          </div>
          <div class="min-w-0">
            <p class="font-display text-xl leading-tight text-ink-soft">{{ doc.full_name }}</p>
            <p v-if="doc.nickname" class="text-xs uppercase tracking-[0.16em] text-gold-deep">{{ doc.nickname }}</p>
            <p v-if="doc.bio" class="mt-1 text-sm leading-relaxed text-ink-muted">{{ doc.bio }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
