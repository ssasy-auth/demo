import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const AppTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#2A85F5',
    secondary: '#5BF5A2',
    warning: '#F5BA4E',
    error: '#F58842',
    background: '#F54736'
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