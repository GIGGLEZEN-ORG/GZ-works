/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: '#00f0ff',
          magenta: '#f04de4',
          purple: '#a855f7',
          emerald: '#00ff9d',
          amber: '#ffbe0b',
          blue: '#3b82f6',
          dark: '#05070f',
          surface: '#0b0f1d',
          glass: 'rgba(14, 19, 36, 0.7)',
        },
        spotify: {
          base: '#05070f',
          black: '#020408',
          elevated: '#0f1424',
          card: '#0b0f1d',
          cardHover: '#161c32',
          border: 'rgba(255, 255, 255, 0.08)',
          subtext: '#94a3b8',
          muted: '#64748b',
          green: '#00f0ff',
          greenBright: '#00f0ff',
          greenDark: '#0284c7',
          highlight: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Syne', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'spotify-card': '0 8px 24px rgba(0,0,0,0.5)',
        'spotify-elevated': '0 16px 32px rgba(0,0,0,0.6)',
        'spotify-green': '0 8px 24px rgba(0, 240, 255, 0.28)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'neon-magenta': '0 0 20px rgba(240, 77, 228, 0.35)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.35)',
        'neon-emerald': '0 0 20px rgba(0, 255, 157, 0.35)',
      },
      animation: {
        'equalizer-1': 'equalizer 0.8s ease-in-out infinite alternate',
        'equalizer-2': 'equalizer 0.6s ease-in-out 0.2s infinite alternate',
        'equalizer-3': 'equalizer 0.9s ease-in-out 0.4s infinite alternate',
        'equalizer-4': 'equalizer 0.7s ease-in-out 0.1s infinite alternate',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
      keyframes: {
        equalizer: {
          '0%': { height: '3px' },
          '100%': { height: '16px' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
