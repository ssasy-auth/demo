<script setup lang="ts">
import { useSidebarStore } from '@/stores';
import NavList from './lists/NavList.vue';

const sidebarStore = useSidebarStore();

</script>

<template>
  <v-navigation-drawer
    v-model="sidebarStore.visible"
    rounded="e-lg">
    
    <nav-list />
    
  </v-navigation-drawer>

</template>