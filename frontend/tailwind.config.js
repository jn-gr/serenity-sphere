import daisyui from "daisyui";

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
        primary: {
          light: "#E0F2FE",
          DEFAULT: "#38BDF8",
          dark: "#0EA5E9",
        },
        secondary: {
          light: "#D1FAE5",
          DEFAULT: "#34D399",
          dark: "#10B981",
        },
        calm: {
          100: "#F0F4F8",
          200: "#D9E2EC",
          300: "#BCCCDC",
          400: "#9FB3C8",
        },
        serenity: {
          DEFAULT: "#8BAAAD",
          dark: "#6B8A8D",
        },
        'theme-color-card': '#b4c7ed',
        'theme-color-dark-card': '#1c1d22',
      },
    },
  },
  plugins: [daisyui],
}

