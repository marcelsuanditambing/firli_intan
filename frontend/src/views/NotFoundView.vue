<script setup>
import Monogram from '@/components/ui/Monogram.vue';
import { texts } from '@/config';
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center px-6 text-center">
    <Monogram :size="80" />
    <h1 class="mt-6 font-display text-5xl text-ink-soft">404</h1>
    <p class="mt-2 text-sm text-ink-muted">{{ texts.notFound }}</p>
    <RouterLink to="/" class="mt-6 text-xs uppercase tracking-[0.2em] text-gold-deep underline">{{ texts.backHome }}</RouterLink>
  </main>
</template>
