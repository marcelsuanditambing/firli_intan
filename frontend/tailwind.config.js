/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral palette is driven by CSS variables so dark mode flips
        // automatically without per-element dark: classes.
        cream: 'rgb(var(--c-cream) / <alpha-value>)',
        ivory: 'rgb(var(--c-ivory) / <alpha-value>)',
        sand: 'rgb(var(--c-sand) / <alpha-value>)',
        shell: 'rgb(var(--c-shell) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--c-ink) / <alpha-value>)',
          soft: 'rgb(var(--c-ink-soft) / <alpha-value>)',
          muted: 'rgb(var(--c-ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--c-ink-faint) / <alpha-value>)',
        },
        // Warna aksen (nama "gold" dipertahankan dari Filo). Nilainya datang dari
        // src/config/theme.generated.css -> ikut tema di site.config.js.
        gold: {
          soft: 'rgb(var(--c-gold-soft) / <alpha-value>)',
          DEFAULT: 'rgb(var(--c-gold) / <alpha-value>)',
          deep: 'rgb(var(--c-gold-deep) / <alpha-value>)',
        },
        blush: 'rgb(var(--c-blush) / <alpha-value>)',
        rose: '#C9959B', // warna pesan error (tetap)
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['Parisienne', 'cursive'],
      },
      letterSpacing: { eyebrow: '0.32em' },
      maxWidth: { invite: '30rem' },
      boxShadow: {
        card: '0 18px 50px -28px rgba(0, 0, 0, 0.45)',
        soft: '0 10px 30px -20px rgba(0, 0, 0, 0.4)',
        gold: '0 14px 34px -16px rgb(var(--c-gold-deep) / 0.55)',
      },
      keyframes: {
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        nudge: { '0%,100%': { transform: 'translateY(0)', opacity: '0.6' }, '50%': { transform: 'translateY(6px)', opacity: '1' } },
        sheen: { '0%,100%': { opacity: '0.35' }, '50%': { opacity: '0.6' } },
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        floaty: 'floaty 7s ease-in-out infinite',
        nudge: 'nudge 1.8s ease-in-out infinite',
        sheen: 'sheen 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
