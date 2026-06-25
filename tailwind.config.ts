// tailwind.config.js
module.exports = {
  darkMode: 'class', // <-- ОБЯЗАТЕЛЬНО ДОБАВЬТЕ ЭТУ СТРОЧКУ
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}