<script setup>
import { onMounted, reactive } from 'vue';
import { useWishesStore } from '@/stores/wishes.js';
import { formatDate } from '@/utils/format.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import BaseButton from '@/components/ui/BaseButton.vue';

const store = useWishesStore();
const form = reactive({ guest_name: '', guest_relation: '', message: '' });

onMounted(() => store.fetch());

async function onSubmit() {
  const ok = await store.submit({ ...form });
  if (ok) {
    form.guest_name = '';
    form.guest_relation = '';
    form.message = '';
  }
}
</script>

<template>
  <section id="ucapan" class="bg-ivory px-6 py-20">
    <SectionHeading :eyebrow="texts.wishesEyebrow" :title="texts.wishesTitle" />

    <!-- Form -->
    <form class="mx-auto mt-10 max-w-md space-y-4" @submit.prevent="onSubmit" novalidate>
      <div>
        <input
          v-model="form.guest_name"
          type="text"
          :placeholder="texts.wishesNamePlaceholder"
          maxlength="100"
          class="w-full rounded-xl border border-shell bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
        <p v-if="store.fieldErrors.guest_name" class="mt-1 text-xs text-rose">{{ store.fieldErrors.guest_name }}</p>
      </div>

      <input
        v-model="form.guest_relation"
        type="text"
        :placeholder="texts.wishesRelationPlaceholder"
        maxlength="60"
        class="w-full rounded-xl border border-shell bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
      />

      <div>
        <textarea
          v-model="form.message"
          rows="3"
          :placeholder="texts.wishesMessagePlaceholder"
          maxlength="2000"
          class="w-full resize-none rounded-xl border border-shell bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        ></textarea>
        <p v-if="store.fieldErrors.message" class="mt-1 text-xs text-rose">{{ store.fieldErrors.message }}</p>
      </div>

      <div class="flex flex-col items-center gap-3">
        <BaseButton type="submit" :disabled="store.submitting">
          {{ store.submitting ? 'Mengirim…' : 'Kirim Ucapan' }}
        </BaseButton>
        <p v-if="store.submitted" class="text-center text-sm text-gold-deep">
          {{ store.submitMessage }}
        </p>
        <p v-else-if="store.submitError" class="text-center text-sm text-rose">{{ store.submitError }}</p>
      </div>
    </form>

    <!-- List -->
    <div class="mx-auto mt-12 max-w-md">
      <template v-if="store.loading">
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="rounded-2xl bg-cream p-5">
            <SkeletonLine width="35%" height="0.9rem" />
            <div class="mt-3 space-y-2"><SkeletonLine /><SkeletonLine width="80%" /></div>
          </div>
        </div>
      </template>

      <ErrorState v-else-if="store.error" :message="store.error" @retry="store.fetch({}, true)" />

      <p v-else-if="store.isEmpty" class="text-center text-sm text-ink-muted">{{ texts.wishesEmpty }}</p>

      <ul v-else class="space-y-4">
        <li
          v-for="(wish, i) in store.items"
          :key="wish.id"
          v-reveal="{ delay: (i % 5) * 60 }"
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

      <div v-if="!store.loading && store.items.length" class="mt-8 text-center">
        <RouterLink
          to="/ucapan"
          class="inline-flex items-center gap-2 rounded-full border border-gold px-6 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-gold-deep transition hover:bg-gold/10"
        >
          Lihat Semua Ucapan
        </RouterLink>
      </div>
    </div>
  </section>
</template>
