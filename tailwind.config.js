/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '1024px',
      'lg': '1280px',
      'xl': '1920px',
      'xxl': '3840px'
    },
  },
  plugins: [require("daisyui")],
}