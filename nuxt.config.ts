// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Server-only. Set via NUXT_SPOTIFY_CLIENT_ID / NUXT_SPOTIFY_CLIENT_SECRET.
    spotifyClientId: '',
    spotifyClientSecret: '',
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
})
