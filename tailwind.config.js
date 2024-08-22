/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        spotifyDark: '#0d0f14',
        spotifyGreen: '#1ed760',
        spotifyDarkGreen: '#1DB954',
      },
    },
  },
  plugins: [],
}

