import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'calc-bg': '#1a1a2e',
        'calc-panel': '#16213e',
        'calc-display': '#0f3460',
        'calc-btn-num': '#1a1a2e',
        'calc-btn-op': '#e94560',
        'calc-btn-sci': '#533483',
        'calc-btn-mem': '#0f3460',
        'calc-btn-eq': '#e94560',
      },
      animation: {
        'press': 'press 0.1s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.2s ease-in',
      },
      keyframes: {
        press: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
