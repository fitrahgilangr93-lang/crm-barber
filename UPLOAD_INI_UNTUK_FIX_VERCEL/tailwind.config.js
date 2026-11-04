/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#101520',
          800: '#141B29',
          750: '#1A2335',
          700: '#222D42',
          600: '#33415C',
          500: '#4A5B78',
        },
        gold: {
          50: '#FFFDF0',
          100: '#FFF9D6',
          200: '#FEF0A3',
          300: '#FDE46B',
          400: '#F5D036',
          500: '#D4AF37', // Luxury primary gold
          600: '#B89225',
          700: '#947217',
          800: '#71540E',
          900: '#4D3807',
          950: '#2C1F03',
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D036 0%, #D4AF37 50%, #AA7C11 100%)',
        'gold-gradient-soft': 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 208, 54, 0.05) 100%)',
        'dark-gradient': 'linear-gradient(180deg, #101520 0%, #0B0F17 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px -3px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 35px -5px rgba(212, 175, 55, 0.5)',
        'dark-elevation': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
