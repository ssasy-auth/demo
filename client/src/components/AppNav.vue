<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { useSidebarStore } from '@/stores';
import AppLogo from './AppLogo.vue';

const sidebarStore = useSidebarStore();

const { name } = useDisplay();

</script>

<template>
  <v-app-bar
    app
    flat
    color="transparent"
    class="bar-container">
    <v-app-bar-nav-icon
      v-if="name === 'xs' || name === 'sm'"
      icon="mdi-account-circle"
      @click="sidebarStore.toggle"/>

    <router-link
      class="bar-logo hide-link"
      to="/">
      <app-logo />
    </router-link>

    <v-spacer />
  </v-app-bar>
</template>

<style scoped>
.bar-container {
  position: relative;
}

.bar-logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>