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
      'lg-xl': '1600px',
      'xl': '1920px',
      'xl-xxl': '2560px',
      'xxl': '3840px'
    },
  },
  daisyui: {
    themes: ["dark"]
  },
  plugins: [require("daisyui")],
}