import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import type { ThemeDefinition } from 'vuetify'

const customLightTheme: ThemeDefinition = {
  dark: false,
  variables: {},
  colors: {
    background: '#f5f5f5',
    surface: '#f5f5f5',
    primary: '#0058c9',
    'on-primary': '#ffffff',
    secondary: '#f7bb41',
    'on-secondary': '#ffffff',
    info: '#b3e5fc',
    warning: '#ffeb3b',
    error: '#ba1a1a'
  } 
}

const customDarkTheme: ThemeDefinition = {
  dark: true,
  variables: {},
  colors: {
    background: '#1b1b1f',
    surface: '#1b1b1f',
    primary: '#afc6ff',
    secondary: '#ffb960',
    info: '#b3e5fc',
    warning: '#ffeb3b',
    error: '#ffb4ab'
  } 
}

export function setupVuetify(){
  return createVuetify({  
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: customLightTheme,
        dark: customDarkTheme
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