import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#090707',
        espresso: '#30201B',
        gold: { DEFAULT: '#D6A65B', soft: '#E6C48F', deep: '#A97E3C' },
        crimson: { DEFAULT: '#9E171D', deep: '#7A1217' },
        ivory: { DEFAULT: '#F3EBDD', dim: '#CFC5B3' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { luxe: '0.22em', wide2: '0.14em' },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseSoft: { '0%,100%': { opacity: '0.4' }, '50%': { opacity: '0.8' } },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out both',
        'slide-in': 'slideIn 0.35s ease-out both',
        'slide-in-left': 'slideInLeft 0.35s ease-out both',
        'pulse-soft': 'pulseSoft 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
