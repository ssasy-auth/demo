<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Bridge } from '@this-oliver/ssasy-ext';
import { useNavStore, useSidebarStore } from '@/stores'
const navStore = useNavStore();
const sidebarStore = useSidebarStore();

const options = computed(() => {
  const router = useRouter(); 
  
  return navStore.getOptions(router);
})

onMounted(async () => {
  // only check for extension if the store says it hasn't been checked yet
  if(!navStore.extensionInstalled){
    const installed = await Bridge.isExtensionInstalled();
    navStore.setExtensionInstalled(installed);
  }
})

</script>

<template>
  <v-navigation-drawer
    v-model="sidebarStore.visible"
    :scrim="false">
    <v-list>
      <v-list-item
        v-for="option in options"
        :key="option.label"
        :to="option.to"
        :color="option.color"
        @click="option.action">
        <v-list-item-title>{{ option.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>