import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141414', ivory: '#FEFCF8', stone: '#F5F1EA', mist: '#E9E2D7', gold: '#B89A62', rose: '#EAD2D0',
        noir: '#141414', cream: '#FEFCF8', 'cream-dark': '#F5F1EA', sage: '#7B977D'
      },
      fontFamily: { serif: ['var(--font-serif)'], sans: ['var(--font-sans)'] },
      boxShadow: { soft: '0 24px 70px rgba(20,20,20,.08)' }
    }
  }, plugins: []
};
export default config;
