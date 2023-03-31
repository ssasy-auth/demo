<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores'
import { useNavRoutes } from '@/composables'

  const router = useRouter(); 
const sidebarStore = useSidebarStore();
  
const { getAppOptions, getAuthOptions } = useNavRoutes(router);
</script>

<template>
  <v-navigation-drawer
    v-model="sidebarStore.visible"
    :scrim="false">
    <v-list>
      <v-list-item
        v-for="option in getAppOptions"
        :key="option.label"
        :to="option.to"
        v-for="option in getAuthOptions"
        @click="option.action">
        <v-list-item-title>{{ option.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>