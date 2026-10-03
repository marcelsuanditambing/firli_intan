<script setup>
import { watch } from 'vue';
import { useUiStore } from '@/stores/ui.js';
import { useBabyStore } from '@/stores/baby.js';
import { getSessionId } from '@/composables/useSession.js';
import { useBackgroundMusic } from '@/composables/useBackgroundMusic.js';
import { useSeo } from '@/composables/useSeo.js';
import { site } from '@/config';
import api from '@/services/api.js';

import SplashScreen from '@/components/layout/SplashScreen.vue';
import FloatingDock from '@/components/layout/FloatingDock.vue';

const ui = useUiStore();
const baby = useBabyStore();
const music = useBackgroundMusic();
const seo = useSeo();

// Title & meta awal sudah disuntikkan saat build (vite.config.js). Di sini
// hanya disinkronkan bila nama di database berbeda dari config.
watch(
  () => baby.data,
  (data) => {
    if (!data) return;
    seo.apply({
      title: data.name === site.baby.fullName ? site.seo.title : `${data.name} · ${site.texts.seoTitleSuffix}`,
      description: site.seo.description,
    });
  }
);

function onOpen() {
  ui.openInvitation();
  music.start(); // gesture-initiated autoplay
  api.logVisit({ session_id: getSessionId(), page_path: '/' }).catch(() => {});
}
</script>

<template>
  <div class="min-h-screen bg-sand md:py-8">
    <div class="relative mx-auto w-full max-w-invite bg-cream shadow-card md:rounded-[2rem] md:overflow-hidden">
      <RouterView />
    </div>

    <FloatingDock />

    <Transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-all duration-700"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <SplashScreen v-if="ui.splashOpen" @open="onOpen" />
    </Transition>
  </div>
</template>
