/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c3aed",
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          light: "#a855f7",
          dark: "#6d28d9",
        },
        secondary: {
          DEFAULT: "#14b8a6",
          light: "#2dd4bf",
          dark: "#0d9488",
        },
        accent: {
          DEFAULT: "#f97316",
          light: "#fb923c",
          dark: "#ea580c",
        },
        danger: "#ef4444",
        success: "#10b981",
        purple: {
          DEFAULT: "#8b5cf6",
          light: "#a78bfa",
        },
        teal: {
          DEFAULT: "#14b8a6",
          light: "#2dd4bf",
          dark: "#0d9488",
        },
        // Dark UI palette - warmer, more sophisticated
        surface: {
          DEFAULT: "#0c0a14",
          1: "#110e1f",
          2: "#16132a",
          3: "#1c1836",
          4: "#221d42",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124,58,237,0.12), transparent)',
        'card-gradient': 'linear-gradient(145deg, rgba(22,19,42,0.6), rgba(12,10,20,0.8))',
        'btn-gradient': 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(124,58,237,0.35)',
        'glow-teal': '0 0 30px rgba(20,184,166,0.35)',
        'glow-orange': '0 0 30px rgba(249,115,22,0.35)',
        card: '0 4px 24px rgba(0,0,0,0.3)',
        'card-hover': '0 20px 50px -12px rgba(124,58,237,0.25)',
      },
      animation: {
        'scanline': 'scanline 2.5s ease-in-out infinite',
        'status-ring': 'status-ring 2.5s infinite',
        'float': 'float 4s ease-in-out infinite',
        'fade-up': 'fadeUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
