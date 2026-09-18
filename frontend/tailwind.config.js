/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'neon-gold': '#F5C842',
        'neon-cyan': '#00F0FF',
        'neon-purple': '#A855F7',
        'primary': '#1B2A4A',
        'secondary': '#C49B3B',
        'accent': '#A67C52',
        'cream': '#F8F6F1',
        'dark': '#2D2D2D',
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(0,0,0,0.08)',
        'premium-lg': '0 20px 60px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}