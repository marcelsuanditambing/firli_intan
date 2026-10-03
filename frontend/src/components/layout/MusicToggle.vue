<script setup>
import { useBackgroundMusic } from '@/composables/useBackgroundMusic.js';
const { playing, hasTrack, toggle } = useBackgroundMusic();
</script>

<template>
  <button
    v-if="hasTrack"
    class="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-white shadow-gold transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    :aria-label="playing ? 'Jeda musik' : 'Putar musik'"
    @click="toggle"
  >
    <svg v-if="playing" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5h3v14H8zM13 5h3v14h-3z"/></svg>
    <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
  </button>
</template>
