/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['dogica'],
      },
      scale: { 101: '1.01' },
    },
  },
}
