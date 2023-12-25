// https://nuxt.com/docs/api/configuration/nuxt-config
const ONE_DAY = 60 * 60 * 24 * 1000;
const ONE_WEEK = ONE_DAY * 7;

export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ["@/assets/css/main.css"],
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/image',],
  nitro: {
    plugins: ["~/server/index.ts"],
  },
 runtimeConfig: {
  cookieName: process.env.COOKIE_NAME || "__session",
  cookieSecret: process.env.COOKIE_SECRET || "secret",
  cookieExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || ONE_DAY.toString(), 10), // 1 day
  cookieRememberMeExpires: parseInt(process.env.COOKIE_REMEMBER_ME_EXPIRES || ONE_WEEK.toString(), 10), // 7 days
  mongodbUri: process.env.MONGODB_URI,
 }

})
