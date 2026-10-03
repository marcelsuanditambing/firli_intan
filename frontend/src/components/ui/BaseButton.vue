<script setup>
defineProps({
  variant: { type: String, default: 'solid' }, // solid | outline
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-60"
    :class="variant === 'solid'
      ? 'bg-gradient-to-br from-gold-soft to-gold-deep text-white shadow-gold hover:shadow-soft hover:-translate-y-0.5'
      : 'border border-gold text-gold-deep hover:bg-gold/10'"
  >
    <slot />
  </button>
</template>
