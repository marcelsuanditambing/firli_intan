<script setup>
import BackToTopButton from './BackToTopButton.vue';
import ThemeToggle from './ThemeToggle.vue';
import MusicToggle from './MusicToggle.vue';
</script>

<template>
  <div class="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
    <BackToTopButton />
    <ThemeToggle />
    <MusicToggle />
  </div>
</template>
