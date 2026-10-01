export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-navy': '#0B1026',
        'royal-purple': '#4C1D95',
        'deep-purple': '#312E81',
        'gold': '#C9A227',
        'champagne': '#E7D7A5',
        'surface': '#FFFFFF',
        'background-soft': '#F7F7FB',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(11, 16, 38, 0.1)',
      }
    },
  },
  plugins: [],
}
