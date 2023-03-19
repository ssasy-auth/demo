<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import { ExtensionMessenger } from '@/logic';
import { useNavStore, useSidebarStore } from '@/stores'
import BaseBtn from './base/BaseBtn.vue';
import AppLogo from './AppLogo.vue';

const navStore = useNavStore();
const sidebarStore = useSidebarStore();
const { name } = useDisplay();

const isSmallScreen = computed(() => {
  return name.value === 'xs' || name.value === 'sm';
});

onMounted(async () => {
  const installed = await ExtensionMessenger.extensionInstalled();
  navStore.setExtensionInstalled(installed);
})

</script>

<template>
  <v-app-bar
    app
    flat
    class="bar-container">
    <v-app-bar-nav-icon
      v-if="isSmallScreen"
      @click="sidebarStore.toggle" />

      
    <base-btn to="/">
      <app-logo />
    </base-btn>

    <v-spacer />

    <div
      v-if="!isSmallScreen"
      style="padding-right: 25px;">
      <base-btn
        v-for="option in navStore.getOptions"
        :key="option.label"
        :to="option.to"
        :color="option.color"
        :tonal="true"
        class="mx-1"
        @click="option.action">
        {{ option.label }}
      </base-btn>
    </div>
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