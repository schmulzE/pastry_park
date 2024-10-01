// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  
  devtools: { enabled: false },

  css: ["@/assets/css/main.css"],

  build:{
    transpile: ['vue-toastification']
  },

  plugins: [
    '~/plugins/mobile-detect.ts'
  ],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    'nuxt-server-utils',
    '@sidebase/nuxt-auth',
    "@nuxtjs/google-fonts",
  ],

  googleFonts: {
    families: {
      Roboto: true,
      'Open Sans': [400, 700],
      Lora: {
        wght: [400],
        ital: [400]
      },
      Mulish: {
        wght: '200..500',
        ital: '200..500',
      },
      "Source code Pro": {
        wght: '200..500',
        ital: '200..500',
      }
    }
  },

  nuxtServerUtils: {
    mongodbUri: process.env.MONGODB_URI,
  },

  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
  },

})