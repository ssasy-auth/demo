<script setup lang="ts">
import { onMounted } from 'vue';
import { ExtensionMessenger } from '@/logic';
import { useNavStore, useSidebarStore } from '@/stores'

const navStore = useNavStore();
const sidebarStore = useSidebarStore();

onMounted(async () => {
  // only check for extension if the store says it hasn't been checked yet
  if(!navStore.extensionInstalled){
    const installed = await ExtensionMessenger.extensionInstalled();
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
        v-for="option in navStore.getOptions"
        :key="option.label"
        :to="option.to"
        :color="option.color"
        @click="option.action">
        <v-list-item-title>{{ option.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>