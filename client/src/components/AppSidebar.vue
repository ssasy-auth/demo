<script setup lang="ts">
import { useSidebarStore } from '@/stores';
import AppNavList from './AppNavList.vue';

const sidebarStore = useSidebarStore();

</script>

<template>
  <v-navigation-drawer
    v-model="sidebarStore.visible"
    rounded="e-lg"
    :scrim="false">
    
    <app-nav-list />
    
  </v-navigation-drawer>

</template>