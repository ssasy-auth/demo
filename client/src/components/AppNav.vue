<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify'
import { useSidebarStore } from '@/stores'
import BaseBtn from './base/BaseBtn.vue';
import AppLogo from './AppLogo.vue';

const router = useRouter();
const drawer = useSidebarStore();
const { name } = useDisplay();

const options = [
  { 
    label: 'about',
    action: () => {
      router.push('/about')
    } 
  },
  { 
    label: 'login',
    action: () => {
      console.log('login');
    } 
  },
  { 
    label: 'register',
    action: () => {
      console.log('register')
    }
  }
]

const isSmallScreen = computed(() => {
  return name.value === 'xs' || name.value === 'sm';
});

</script>

<template>
  <v-app-bar
    app
    flat
    color="primary"
    class="bar-container">
    <v-app-bar-nav-icon
      v-if="isSmallScreen"
      @click="drawer.toggle" />

    <app-logo class="bar-logo" />

    <v-spacer />

    <div v-if="!isSmallScreen">
      <base-btn
        v-for="option in options"
        :key="option.label"
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