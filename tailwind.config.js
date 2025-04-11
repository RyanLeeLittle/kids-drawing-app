/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF5E5B",
        secondary: "#39A0ED",
        tertiary: "#4ECDC4",
        accent: "#FFD166",
        background: "#F7F9F9",
      },
      fontFamily: {
        sans: ["Comic Sans MS", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} 