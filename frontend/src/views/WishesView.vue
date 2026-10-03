<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api.js';
import { formatDate } from '@/utils/format.js';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import Monogram from '@/components/ui/Monogram.vue';
import { texts } from '@/config';

const PER_PAGE = 7;
const items = ref([]);
const meta = ref(null);
const loading = ref(false);
const error = ref(null);
const page = ref(1);

const totalPages = computed(() => meta.value?.total_pages || 1);

async function load(p = 1) {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await api.getWishes({ page: p, limit: PER_PAGE });
    items.value = data.data ?? [];
    meta.value = data.meta ?? null;
    page.value = p;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    error.value = e?.response?.data?.message || 'Gagal memuat ucapan.';
  } finally {
    loading.value = false;
  }
}

function goto(p) {
  if (p < 1 || p > totalPages.value || p === page.value) return;
  load(p);
}

onMounted(() => load(1));
</script>

<template>
  <main class="min-h-screen px-6 py-16">
    <div class="mx-auto max-w-md">
      <div class="flex justify-center" v-reveal><Monogram :size="64" /></div>
      <div class="mt-6">
        <SectionHeading :eyebrow="texts.wishesEyebrow" :title="texts.wishesAllTitle" />
      </div>
      <p v-if="meta" class="mt-3 text-center text-sm text-ink-muted">
        Total {{ meta.total }} ucapan &amp; doa
      </p>

      <!-- Loading -->
      <div v-if="loading" class="mt-10 space-y-4">
        <div v-for="i in 5" :key="i" class="rounded-2xl bg-cream p-5">
          <SkeletonLine width="35%" height="0.9rem" />
          <div class="mt-3 space-y-2"><SkeletonLine /><SkeletonLine width="80%" /></div>
        </div>
      </div>

      <ErrorState v-else-if="error" :message="error" @retry="load(page)" class="mt-10" />

      <p v-else-if="!items.length" class="mt-10 text-center text-sm text-ink-muted">
        Belum ada ucapan.
      </p>

      <!-- List -->
      <ul v-else class="mt-10 space-y-4">
        <li
          v-for="(wish, i) in items"
          :key="wish.id"
          v-reveal="{ delay: (i % 7) * 50 }"
          class="rounded-2xl border border-shell/70 bg-cream p-5"
        >
          <div class="flex items-baseline justify-between gap-3">
            <p class="font-display text-lg text-ink-soft">{{ wish.guest_name }}</p>
            <span v-if="wish.created_at" class="text-[0.65rem] uppercase tracking-wider text-ink-faint">
              {{ formatDate(String(wish.created_at).slice(0, 10), { withDay: false }) }}
            </span>
          </div>
          <p v-if="wish.guest_relation" class="text-xs text-gold-deep">{{ wish.guest_relation }}</p>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">{{ wish.message }}</p>
        </li>
      </ul>

      <!-- Pagination -->
      <div v-if="!loading && totalPages > 1" class="mt-10 flex items-center justify-center gap-2">
        <button
          class="grid h-9 w-9 place-items-center rounded-full border border-shell bg-ivory text-gold-deep transition hover:bg-gold/10 disabled:opacity-40"
          :disabled="page === 1"
          aria-label="Sebelumnya"
          @click="goto(page - 1)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 6l-6 6 6 6"/></svg>
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          class="h-9 min-w-9 rounded-full px-3 text-sm transition"
          :class="p === page ? 'bg-gradient-to-br from-gold-soft to-gold-deep text-white shadow-gold' : 'border border-shell bg-ivory text-ink-muted hover:bg-gold/10'"
          @click="goto(p)"
        >
          {{ p }}
        </button>

        <button
          class="grid h-9 w-9 place-items-center rounded-full border border-shell bg-ivory text-gold-deep transition hover:bg-gold/10 disabled:opacity-40"
          :disabled="page === totalPages"
          aria-label="Berikutnya"
          @click="goto(page + 1)"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>

      <!-- Back -->
      <div class="mt-12 text-center">
        <RouterLink to="/" class="text-xs uppercase tracking-[0.2em] text-gold-deep underline">
          Kembali ke Beranda
        </RouterLink>
      </div>
    </div>
  </main>
</template>
