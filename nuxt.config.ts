import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },

  srcDir: './src/',

  build: {
    transpile: ['vuetify'],
  },

  css: [
    '@/assets/scss/global.scss',
  ],

  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@nuxt/eslint',
  ],

  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: false,
        commaDangle: 'always-multiline',
        quotes: 'single',
      },
    },
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
  },
})
