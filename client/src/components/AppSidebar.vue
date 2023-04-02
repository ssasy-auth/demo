<script setup lang="ts">
import { useSidebarStore } from '@/stores';
import NavList from './NavList.vue';

const sidebarStore = useSidebarStore();

</script>

<template>
  <v-navigation-drawer
    v-model="sidebarStore.visible"
    rounded="e-lg"
    :scrim="false">
    
    <nav-list />
    
  </v-navigation-drawer>

</template>