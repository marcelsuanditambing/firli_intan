<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const visible = ref(false);
function onScroll() { visible.value = window.scrollY > 480; }
function toTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}
onMounted(() => { window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); });
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <Transition
    enter-active-class="transition duration-300" leave-active-class="transition duration-300"
    enter-from-class="opacity-0 translate-y-2" leave-to-class="opacity-0 translate-y-2"
  >
    <button
      v-if="visible"
      class="grid h-12 w-12 place-items-center rounded-full border border-shell bg-ivory text-gold-deep shadow-soft transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      aria-label="Kembali ke atas"
      @click="toTop"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  </Transition>
</template>
