import { ref } from 'vue';

// Animate a number from 0 to target once triggered.
export function useCountUp(duration = 1400) {
  const value = ref(0);
  let started = false;
  function run(target) {
    if (started) return;
    started = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !target) { value.value = target; return; }
    const start = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      value.value = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  return { value, run };
}
