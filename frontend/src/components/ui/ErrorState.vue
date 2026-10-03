<script setup>
import BaseButton from './BaseButton.vue';
import { texts } from '@/config';
defineProps({ message: { type: String, default: () => texts.loadError } });
defineEmits(['retry']);
</script>

<template>
  <div class="flex flex-col items-center gap-4 rounded-2xl border border-shell bg-ivory/70 px-6 py-10 text-center">
    <p class="text-sm text-ink-muted">{{ message }}</p>
    <BaseButton variant="outline" @click="$emit('retry')">{{ texts.retry }}</BaseButton>
  </div>
</template>
