/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "index.html", "./src/**/*.{html,js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
    backgroundImage: {
      "desktop": "url('assets/images/tailwind-vue-langchain.webp')",
      "mobile": "url('assets/images/tailwind-vue-langchain.webp')"
    },
  },
  plugins: [],
}