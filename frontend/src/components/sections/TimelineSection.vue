<script setup>
import { onMounted } from 'vue';
import { useTimelineStore } from '@/stores/timeline.js';
import { formatDate } from '@/utils/format.js';
import { texts } from '@/config';
import SectionHeading from '@/components/ui/SectionHeading.vue';
import SkeletonLine from '@/components/ui/SkeletonLine.vue';
import ErrorState from '@/components/ui/ErrorState.vue';

const store = useTimelineStore();
onMounted(() => store.fetch());
</script>

<template>
  <section id="timeline" class="bg-ivory px-6 py-20">
    <SectionHeading :eyebrow="texts.timelineEyebrow" :title="texts.timelineTitle" />

    <div class="mx-auto mt-12 max-w-md">
      <template v-if="store.loading">
        <div class="space-y-8 pl-8">
          <div v-for="i in 3" :key="i" class="space-y-2">
            <SkeletonLine width="30%" height="0.7rem" />
            <SkeletonLine width="70%" height="1.1rem" />
            <SkeletonLine width="90%" />
          </div>
        </div>
      </template>

      <ErrorState v-else-if="store.error" :message="store.error" @retry="store.fetch({}, true)" />

      <p v-else-if="store.isEmpty" class="text-center text-sm text-ink-muted">{{ texts.timelineEmpty }}</p>

      <ol v-else class="relative border-l border-gold-soft/50 pl-8">
        <li
          v-for="(item, i) in store.items"
          :key="item.id"
          v-reveal="{ delay: i * 80 }"
          class="relative pb-9 last:pb-0"
        >
          <span class="absolute -left-[2.15rem] top-1 grid h-7 w-7 place-items-center rounded-full border border-gold-soft bg-cream">
            <span class="h-2 w-2 rounded-full bg-gold"></span>
          </span>
          <p v-if="item.event_date || item.week_number" class="eyebrow text-[0.6rem]">
            <template v-if="item.week_number">Minggu {{ item.week_number }}</template>
            <template v-if="item.week_number && item.event_date"> · </template>
            <template v-if="item.event_date">{{ formatDate(item.event_date, { withDay: false }) }}</template>
          </p>
          <h3 class="mt-1 font-display text-xl text-ink-soft">{{ item.title }}</h3>
          <p v-if="item.description" class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.description }}</p>
          <img
            v-if="item.image_url"
            :src="item.image_url"
            :alt="item.title"
            loading="lazy"
            class="mt-3 w-full max-w-[16rem] rounded-2xl object-cover shadow-soft"
          />
        </li>
      </ol>
    </div>
  </section>
</template>
