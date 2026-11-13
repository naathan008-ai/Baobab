/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // ===== Brand blues =====
        primary: {
          DEFAULT: '#1E5F9E',
          light: '#2D7AC4',
          dark: '#14406E',
          50: '#EFF6FC',
          100: '#D9E8F5',
        },
        secondary: {
          DEFAULT: '#38BDF8',
          light: '#7DD3FC',
          dark: '#0284C7',
        },
        accent: '#4F46E5',

        // ===== Legacy aliases (keeps existing code working) =====
        // Anywhere you wrote text-neon-gold / bg-neon-cyan / etc.,
        // it now resolves to the professional blue palette.
        'neon-gold': '#1E5F9E',    // primary blue
        'neon-cyan': '#0EA5E9',    // sky blue
        'neon-purple': '#4F46E5',  // indigo
        'neon-blue': '#2563EB',

        // ===== Text =====
        ink: {
          DEFAULT: '#0F2942',  // headings
          soft: '#334155',     // body
          muted: '#64748B',    // secondary
          faint: '#94A3B8',    // very light
        },

        // ===== Surfaces =====
        surface: {
          DEFAULT: '#FFFFFF',  // cards
          soft: '#F5F9FD',     // page bg
          muted: '#EFF5FB',    // subtle hover
          border: '#DBE6F0',   // borders
        },

        // ===== Status =====
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 20px rgba(15,41,66,0.06)',
        'premium-lg': '0 12px 40px rgba(15,41,66,0.10)',
      },
    },
  },
  plugins: [],
};