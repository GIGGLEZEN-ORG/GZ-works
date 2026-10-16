/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          base: '#121212',
          black: '#000000',
          elevated: '#242424',
          card: '#181818',
          cardHover: '#282828',
          border: '#2a2a2a',
          subtext: '#b3b3b3',
          muted: '#727272',
          green: '#1db954',
          greenBright: '#1ed760',
          greenDark: '#169c46',
          highlight: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['CircularSp', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'spotify-card': '0 8px 24px rgba(0,0,0,0.5)',
        'spotify-elevated': '0 16px 32px rgba(0,0,0,0.6)',
        'spotify-green': '0 8px 24px rgba(210,65,220,0.28)',
      },
      animation: {
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite alternate',
        'equalizer-2': 'equalizer 0.6s ease-in-out 0.2s infinite alternate',
        'equalizer-3': 'equalizer 0.9s ease-in-out 0.4s infinite alternate',
        'equalizer-4': 'equalizer 0.7s ease-in-out 0.1s infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        equalizer: {
          '0%': { height: '3px' },
          '100%': { height: '16px' }
        }
      }
    },
  },
  plugins: [],
}
