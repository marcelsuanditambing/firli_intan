<script setup>
import { computed } from 'vue';
import { splitCredentials, paragraphs } from '@/config';

// Kartu dokter/bidan. full_name "dr. Nama, Sp.OG, ..." -> nama + gelar di baris kedua.
// Bio boleh beberapa paragraf (dipisah baris kosong).
// Nama + gelar panjang atau bio panjang -> kartu vertikal (foto di atas).
const props = defineProps({ doctor: { type: Object, required: true } });

const parts = computed(() => splitCredentials(props.doctor.full_name || ''));
const bio = computed(() => paragraphs(props.doctor.bio));
const initial = computed(() =>
  (parts.value.name.replace(/^(dr|drg|bd|bidan|ns)\.?\s+/i, '') || '?').charAt(0).toUpperCase()
);
const vertical = computed(
  () => parts.value.credentials.length > 24 || bio.value.length > 1 || (props.doctor.bio || '').length > 160
);
</script>

<template>
  <div
    class="rounded-2xl border border-gold-soft/40 surface p-5 shadow-soft"
    :class="vertical ? 'px-6 py-8 text-center' : 'flex items-center gap-5 text-left'"
  >
    <div
      class="shrink-0 overflow-hidden rounded-full border border-gold-soft/60 bg-sand"
      :class="vertical ? 'mx-auto h-28 w-28' : 'h-20 w-20'"
    >
      <img v-if="doctor.photo_url" :src="doctor.photo_url" :alt="parts.name" loading="lazy" class="h-full w-full object-cover" />
      <div v-else class="flex h-full w-full items-center justify-center font-display text-3xl text-gold-deep/70">{{ initial }}</div>
    </div>

    <div class="min-w-0" :class="vertical ? 'mt-5' : ''">
      <p class="font-display leading-tight text-ink-soft" :class="vertical ? 'text-2xl' : 'text-xl'">{{ parts.name }}</p>
      <p v-if="parts.credentials" class="mt-1 text-xs leading-relaxed tracking-wide text-gold-deep">{{ parts.credentials }}</p>
      <p v-if="doctor.nickname" class="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-ink-muted">{{ doctor.nickname }}</p>
      <div v-if="bio.length" :class="vertical ? 'mx-auto mt-5 max-w-xs space-y-3' : 'mt-1 space-y-2'">
        <p v-for="(para, i) in bio" :key="i" class="text-sm leading-relaxed text-ink-muted">{{ para }}</p>
      </div>
    </div>
  </div>
</template>
