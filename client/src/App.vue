<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import AppNav from './components/AppNav.vue';
import NavList from './components/NavList.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppFooter from './components/AppFooter.vue';

const isDesktop = computed(() => {
  const { name } = useDisplay();
  return name.value === 'md' || name.value === 'lg' || name.value === 'xl';
});

</script>

<template>
  <v-app>
    <app-nav />
    <app-sidebar v-if="!isDesktop" />
    
    <v-main>
      <v-container>
        <v-row justify="space-between">
          <!-- left bar -->
          <v-col
            v-if="isDesktop"
            cols="3">
            <nav-list />
          </v-col>
          
          <!-- center bar -->
          <v-col md="6">
            <router-view />
          </v-col>
          
          <!-- right bar -->
          <v-col
            v-if="isDesktop"
            cols="3">
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <app-footer />
  </v-app>
</template>