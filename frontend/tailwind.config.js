/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1E3A8A',      // azul marino principal
        'navy-light': '#233876' // opcional: variante más clara
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'] // fuente "médica" (Nunito como ejemplo)
      }
    }
  },
  plugins: []
}
