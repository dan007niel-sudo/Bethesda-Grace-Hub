/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: '#8B1E24',
        gold: '#D8B76A',
        cream: '#F8F3E8',
        charcoal: '#241F1F',
        'soft-border': '#E7DCC8',
      },
      fontFamily: {
        ui: ['var(--font-ui)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '1rem',
      },
    },
  },
  plugins: [],
};
