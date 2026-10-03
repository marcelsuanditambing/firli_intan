<script setup>
import { useTheme } from '@/composables/useTheme.js';
const { theme, toggle } = useTheme();
</script>

<template>
  <button
    class="grid h-12 w-12 place-items-center rounded-full border border-shell bg-ivory text-gold-deep shadow-soft transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    :aria-label="theme === 'dark' ? 'Mode terang' : 'Mode gelap'"
    @click="toggle"
  >
    <svg v-if="theme === 'dark'" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
      <circle cx="12" cy="12" r="4" /><path stroke-linecap="round" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
    <svg v-else class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  </button>
</template>
