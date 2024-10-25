import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: false,

    theme: {
      defaultTheme: 'mainTheme',
      themes: {
        mainTheme: {
          colors: {
            primary: '#00E3C8',
            success: '#16c45c',
            error: '#F24236',
          },
        },
      },
    },
  })

  app.vueApp.use(vuetify)
})
