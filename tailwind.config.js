/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // COE Brand Colors - Maroon & Gold
        maroon: {
          50: '#fdf2f4',
          100: '#fce7eb',
          200: '#f9d0d9',
          300: '#f4a9ba',
          400: '#ec7694',
          500: '#e04d72',
          600: '#cb2d5d',
          700: '#a9214a',
          800: '#8c1e41',
          900: '#722F37', // Primary maroon
          950: '#4a0d1e',
        },
        gold: {
          50: '#fdfbf3',
          100: '#fbf5e1',
          200: '#f6e9c3',
          300: '#f0d89c',
          400: '#e8c06d',
          500: '#C9A227', // Primary gold
          600: '#b8922a',
          700: '#997424',
          800: '#7c5d22',
          900: '#664d1f',
          950: '#3a2a0f',
        },
      },
    },
  },
  plugins: [],
}
