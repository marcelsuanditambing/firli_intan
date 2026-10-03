<script setup>
import { ref, computed } from 'vue';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';

const copied = ref(false);

const shareText = computed(() => texts.shareMessage);
const waLink = computed(() => {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  return `https://wa.me/?text=${encodeURIComponent(`${shareText.value} ${url}`)}`;
});

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1800);
  } catch { /* clipboard unavailable */ }
}
</script>

<template>
  <section id="bagikan" class="px-6 py-16">
    <SectionHeading :eyebrow="texts.shareEyebrow" :title="texts.shareTitle" />

    <div class="mx-auto mt-8 flex max-w-xs flex-col gap-3" v-reveal>
      <a
        :href="waLink" target="_blank" rel="noopener"
        class="flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-gold-soft to-gold-deep px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white shadow-gold transition hover:-translate-y-0.5"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.8-1.4A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-2.8.8.8-2.8-.2-.3A8 8 0 1112 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.3.2-.5 0-.2-.1-.9-.4-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.4 0-.1 0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.5c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.2.9 2.4.1.2 1.6 2.5 3.9 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1 0-.1-.2-.2-.4-.3z"/></svg>
        Bagikan ke WhatsApp
      </a>

      <button
        class="flex items-center justify-center gap-2 rounded-full border border-gold px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-gold-deep transition hover:bg-gold/10"
        @click="copyLink"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M10 13a5 5 0 007 0l1-1a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-1 1a5 5 0 007 7l1-1"/></svg>
        {{ copied ? 'Link tersalin' : 'Salin Link' }}
      </button>
    </div>
  </section>
</template>
