<script setup lang="ts">
import { useSidebarStore } from '@/stores'

const drawer = useSidebarStore();

const options = [
  {
    label: 'about',
    to: '/about'
  },
  { 
    label: 'login',
    action: () => {
      console.log('login');
    } 
  },
  { 
    label: 'register',
    action: () => {
      console.log('register')
    }
  }
]

</script>

<template>
  <v-navigation-drawer v-model="drawer.visible">
    <v-list>
      <v-list-item
        v-for="option in options"
        :key="option.label"
        :to="option.to"
        @click="option.action">
        <v-list-item-title>{{ option.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>