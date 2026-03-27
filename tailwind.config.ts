/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',  
  ],
  safelist: [
  'bg-gradient-to-r',
  'from-orange-500',
  'via-pink-500',
  'to-purple-600'
],

  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
