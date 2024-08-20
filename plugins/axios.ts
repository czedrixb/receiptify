import { defineNuxtPlugin } from '#app'
import axios from 'axios'

// Create a custom Axios instance
const api = axios.create({ baseURL: 'https://api.spotify.com/v1' })

export default defineNuxtPlugin(nuxtApp => {
  // Provide the custom Axios instance globally
  nuxtApp.provide('api', api)
  
  // Optionally, you can set Axios globally like this
  // to be used in Vue files through this.$api
  nuxtApp.vueApp.config.globalProperties.$api = api
})
