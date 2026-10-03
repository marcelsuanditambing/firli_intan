<script setup>
import SectionDivider from './SectionDivider.vue';

defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
});
</script>

<template>
  <div class="text-center">
    <p v-if="eyebrow" class="eyebrow mb-3" v-reveal>{{ eyebrow }}</p>
    <h2 class="text-3xl sm:text-4xl font-medium leading-tight" v-reveal="{ delay: 80 }">
      <slot name="title">{{ title }}</slot>
    </h2>
    <div class="mt-4" v-reveal="{ delay: 140 }">
      <SectionDivider />
    </div>
  </div>
</template>
