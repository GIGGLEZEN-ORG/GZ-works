/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          50: '#effbfb',
          100: '#d8f4f4',
          200: '#b3e8e9',
          300: '#7bd6da',
          400: '#3bbac2',
          500: '#139ba7',
          600: '#087e8b',
          700: '#09656f',
          800: '#0d5159',
          900: '#10434a',
          950: '#062d33',
        },
        sky: {
          50: '#effbfb',
          100: '#d8f4f4',
          200: '#b3e8e9',
          300: '#7bd6da',
          400: '#3bbac2',
          500: '#139ba7',
          600: '#087e8b',
          700: '#09656f',
          800: '#0d5159',
          900: '#10434a',
          950: '#062d33',
        },
        mybusbooking: {
          50: '#effbfb',
          100: '#d8f4f4',
          200: '#b3e8e9',
          500: '#087e8b',
          600: '#075e68',
          700: '#0b5260',
          800: '#103b45',
          dark: '#071d25',
          navy: '#102b32',
          gray: '#7e7e8c',
          bg: '#f6f8f7',
        }
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'blue': '0 4px 14px 0 rgba(8, 126, 139, 0.30)',
      }
    },
  },
  plugins: [],
}
