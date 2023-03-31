import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const AppTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#F54736',
    secondary: '#2A85F5',
    warning: '#5BF5A2',
    error: '#F58842'
  }
}

export function setupVuetify(){
  return createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'AppTheme', // other options are 'light' or 'dark'
      themes: {
        AppTheme
      }
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi
      }
    }
  })
}