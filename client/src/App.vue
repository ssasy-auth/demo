<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNav from './components/AppNav.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <v-app>
    <app-nav />
    <app-sidebar />
    
    <v-main id="app-content">
      <router-view />
    </v-main>

    <app-footer />
  </v-app>
</template>
