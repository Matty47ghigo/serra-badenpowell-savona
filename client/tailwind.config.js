/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        botanical: {
          50: '#f2f8f4',
          100: '#e1efe6',
          200: '#c4dfcf',
          300: '#9ac5b0',
          400: '#6ca78c',
          500: '#4a8b70',
          600: '#387059',
          700: '#2d5948',
          800: '#26483b',
          900: '#203c32',
          950: '#10221c',
        },
        terracotta: {
          50: '#fdf6f3',
          100: '#faede7',
          200: '#f5d9cc',
          300: '#edbca7',
          400: '#e29777',
          500: '#d7764f',
          600: '#c75c34',
          700: '#a54728',
          800: '#863c25',
          900: '#6f3523',
        },
        sand: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#eae0cf',
          300: '#ddcaaF',
          400: '#ccaE8b',
          500: '#be966f',
        },
        // Palette viola/purple per branding logo Serra
        viola: {
          50:  '#f5f0ff',
          100: '#ede0ff',
          200: '#d8bfff',
          300: '#c09aff',
          400: '#a06de0',
          500: '#7b3fbe',
          600: '#62289e',
          700: '#4e1f80',
          800: '#3d1865',
          900: '#2d1150',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fadeIn':       'fadeIn 0.5s ease-out forwards',
        'fadeInUp':     'fadeInUp 0.6s ease-out forwards',
        'fadeInScale':  'fadeInScale 0.4s ease-out forwards',
        'pulse-soft':   'pulse-soft 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInScale: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(12px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
      aspectRatio: {
        '4/3':  '4 / 3',
        '16/9': '16 / 9',
      },
    },
  },
  plugins: [],
}
