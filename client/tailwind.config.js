/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: '#C94B1A',
        'ember-glow': '#E8622A',
        'ember-deep': '#7A2710',
        smoke: '#1A1714',
        ash: '#2D2925',
        char: '#3D3530',
        cream: '#F5EFE4',
        gold: '#C9952A',
        'gold-light': '#E8B84B',
        bone: '#E8DDD0',
        stage: '#0F0D0B',
        curtain: '#1E1510',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        bebas: ['"Bebas Neue"', 'cursive'],
        mono: ['"DM Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ember-flicker': 'emberFlicker 4s ease-in-out infinite',
      },
      keyframes: {
        emberFlicker: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
