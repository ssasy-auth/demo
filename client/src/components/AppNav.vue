<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router';
import { useSidebarStore } from '@/stores'
import { useNavRoutes } from '@/composables'
import BaseBtn from './base/BaseBtn.vue';
import AppLogo from './AppLogo.vue';

const router = useRouter(); 
const sidebarStore = useSidebarStore();

const { name } = useDisplay();
const { getAppOptions, getAuthOptions } = useNavRoutes(router);

const isSmallScreen = computed(() => {
  return name.value === 'xs' || name.value === 'sm';
});

</script>

<template>
  <v-app-bar
    app
    flat
    class="bar-container">
    <v-app-bar-nav-icon
      v-if="isSmallScreen"
      @click="sidebarStore.toggle" />

      
    <base-btn
      text
      to="/">
      <app-logo />
    </base-btn>

    <v-spacer />

    <div
      v-if="!isSmallScreen"
      style="padding-right: 25px;">
      <base-btn
        v-for="option in getAppOptions"
        :key="option.label"
        :to="option.to"
        :color="option.color"
        class="mx-1"
        @click="option.action">
        {{ option.label }}
      </base-btn>

      <base-btn
        v-for="option in getAuthOptions"
        :key="option.label"
        :to="option.to"
        :color="option.color"
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