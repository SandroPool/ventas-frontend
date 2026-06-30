/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: '#0c0c14',
          card: '#15151f',
          elevated: '#1e1e2a',
          border: '#2a2a38',
          primary: '#f0f0f5',
          secondary: '#a8a8b8',
          muted: '#6b6b80',
        }
      }
    },
  },
  plugins: [],
}
