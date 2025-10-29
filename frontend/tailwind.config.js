// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all react components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // For styling forms easily
  ],
}