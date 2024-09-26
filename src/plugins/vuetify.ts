import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: 'mainTheme',
      themes: {
        mainTheme: {
          colors: {
            primary: '#00E3C8',
          },
        },
      },
    },
  })

  app.vueApp.use(vuetify)
})
