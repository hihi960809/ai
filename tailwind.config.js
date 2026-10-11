/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'Georgia', 'serif'],
        body: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        tavern: {
          bg: '#0d0a08',
          surface: '#181311',
          card: '#211a16',
          border: '#3a2d22',
          amber: '#d4944a',
          'amber-bright': '#f0b46a',
          'amber-dim': '#8a6230',
          gold: '#c9a44c',
          text: '#e8dcc8',
          'text-dim': '#9c8a70',
          'text-muted': '#6b5d4a',
          danger: '#c25450',
          success: '#5a8a5a',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px 0 rgba(212, 148, 74, 0.3)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(212, 148, 74, 0.5)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.85' },
          '66%': { opacity: '0.95' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'scaleY(0.4)', opacity: '0.4' },
          '30%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
