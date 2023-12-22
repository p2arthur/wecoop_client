/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',

  theme: {
    extend: {
      fontFamily: {
        sans: ['Pixelify Sans'],
      },
      scale: { 101: '1.01' },
    },
  },
}
