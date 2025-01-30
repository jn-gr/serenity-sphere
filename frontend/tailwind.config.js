/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      colors: {
        'theme-color-card': '#b4c7ed',
        'theme-color-dark-card': '#1c1d22',
      },
    },
  },
  plugins: [],
}

