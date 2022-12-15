// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  srcDir: 'src/',
  ssr: false,
  // target: 'static',
  build: {
    // Tauri supports es2021
    // target: ['es2021', 'chrome100', 'safari13'],
    // don't minify for debug builds
    // minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    // sourcemap: !!process.env.TAURI_DEBUG
    transpile: ['kysely']
  },
  css: [
    // '~/style.css',
    '~/assets/index.scss'
  ],
  dir: {
    public: '../public/'
  },
  modules: [
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // automatically imports `defineStore`
          'defineStore', // import { defineStore } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ['defineStore', 'definePiniaStore'] // import { defineStore as definePiniaStore } from 'pinia'
        ]
      }
    ]
  ],
  typescript: {
    strict: true,
    shim: false,
    typeCheck: true
  }
});
