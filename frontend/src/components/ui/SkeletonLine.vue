<script setup>
defineProps({ width: { type: String, default: '100%' }, height: { type: String, default: '0.9rem' } });
</script>
<template>
  <span class="skeleton block" :style="{ width, height }"></span>
</template>
