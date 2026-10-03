<script setup>
import { onMounted, ref } from 'vue';
import { useGiftsStore } from '@/stores/gifts.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';
import ErrorState from '@/components/ui/ErrorState.vue';

const store = useGiftsStore();
const copied = ref(null);
onMounted(() => store.fetch());

const typeLabel = { qris: 'QRIS', bank_transfer: 'Transfer Bank', e_wallet: 'E-Wallet' };

async function copyNumber(gift) {
  if (!gift.account_number) return;
  try {
    await navigator.clipboard.writeText(gift.account_number);
    copied.value = gift.id;
    setTimeout(() => (copied.value = null), 1800);
  } catch { /* clipboard unavailable */ }
}
</script>

<template>
  <section id="gift" class="px-6 py-20">
    <SectionHeading :eyebrow="texts.giftEyebrow" :title="texts.giftTitle" />
    <p class="mx-auto mt-4 max-w-sm text-center text-sm text-ink-muted" v-reveal>
      {{ texts.giftIntro }}
    </p>

    <div class="mx-auto mt-10 max-w-sm space-y-4">
      <template v-if="store.loading">
        <div v-for="i in 2" :key="i" class="rounded-2xl bg-ivory p-6 shadow-soft">
          <SkeletonLine width="30%" height="0.7rem" />
          <div class="mt-3"><SkeletonLine width="60%" height="1.3rem" /></div>
          <div class="mt-2"><SkeletonLine width="50%" /></div>
        </div>
      </template>

      <ErrorState v-else-if="store.error" :message="store.error" @retry="store.fetch({}, true)" />

      <p v-else-if="store.isEmpty" class="text-center text-sm text-ink-muted">Informasi hadiah belum tersedia.</p>

      <div
        v-for="(gift, i) in store.items"
        v-else
        :key="gift.id"
        v-reveal="{ delay: i * 90 }"
        class="rounded-2xl border border-gold-soft/40 bg-ivory p-6 text-center shadow-soft"
      >
        <p class="eyebrow text-[0.6rem]">{{ typeLabel[gift.type] || gift.type }}</p>

        <img
          v-if="gift.type === 'qris' && gift.qris_image_url"
          :src="gift.qris_image_url"
          :alt="`QRIS ${gift.provider_name}`"
          class="mx-auto mt-4 h-44 w-44 rounded-xl bg-white object-contain p-2 shadow-soft"
          loading="lazy"
        />

        <p class="mt-3 font-display text-2xl text-ink-soft">{{ gift.provider_name }}</p>
        <p v-if="gift.account_number" class="mt-1 font-sans text-lg tracking-wider text-ink">{{ gift.account_number }}</p>
        <p v-if="gift.account_name" class="text-sm text-ink-muted">a.n. {{ gift.account_name }}</p>
        <p v-if="gift.note" class="mt-3 text-xs italic text-ink-faint">{{ gift.note }}</p>

        <button
          v-if="gift.account_number"
          class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-gold/60 px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.15em] text-gold-deep transition hover:bg-gold/10"
          @click="copyNumber(gift)"
        >
          {{ copied === gift.id ? 'Tersalin' : 'Salin Nomor' }}
        </button>
      </div>
    </div>
  </section>
</template>
