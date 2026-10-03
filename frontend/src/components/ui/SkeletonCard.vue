<script setup>
defineProps({ aspect: { type: String, default: 'aspect-[4/5]' } });
</script>
<template>
  <div class="overflow-hidden rounded-2xl bg-ivory shadow-soft">
    <div class="skeleton w-full" :class="aspect"></div>
    <div class="space-y-2 p-4">
      <span class="skeleton block h-3 w-3/4"></span>
      <span class="skeleton block h-3 w-1/2"></span>
    </div>
  </div>
</template>
