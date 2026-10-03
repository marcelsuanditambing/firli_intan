// v-reveal: fade/translate an element into view on scroll.
// Usage: v-reveal  or  v-reveal="{ delay: 120 }"
export default {
  mounted(el, binding) {
    el.classList.add('reveal');
    const delay = binding.value?.delay ?? 0;
    if (delay) el.style.transitionDelay = `${delay}ms`;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('reveal-in');
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    el.__revealObserver = io;
  },
  unmounted(el) {
    el.__revealObserver?.disconnect();
  },
};
