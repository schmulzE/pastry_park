// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({

  nitro: {
    preset: 'netlify',
    compressPublicAssets: true
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true
    },
  },
  
  devtools: { enabled: false },
  
  css: ["@/assets/css/main.css"],
  
  build:{
    analyze: false,
    transpile: ['vue-toastification', 'gsap', 'vulgar-fractions']
  },

  plugins: [
    '~/plugins/mobile-detect.ts'
  ],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-server-utils',
    '@sidebase/nuxt-auth',
    "@nuxtjs/google-fonts",
  ],

  googleFonts: {
    families: {
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
    },
    display: 'swap', // Improve perceived performance
    subsets: ['latin'], // Specify subsets
  },

  nuxtServerUtils: {
    mongodbUri: process.env.MONGODB_URI,
  },

  auth: {
    baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://pastry-park.netlify.app' 
    : process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },

  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
  },

})