<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import { useSidebarStore } from '@/stores'
import { AuthLogic } from '@/logic';
import BaseBtn from './base/BaseBtn.vue';
import AppLogo from './AppLogo.vue';

const drawer = useSidebarStore();
const { name } = useDisplay();

const extensionInstalled = ref(false);

const options = [
  { 
    label: 'install ext',
    action: () => {
      console.log('install ext');
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

const getOptions = computed(() => {
  return options.filter(option => {
    if(extensionInstalled.value){
      return option.label !== 'install ext';
    } else {
      return option.label === 'install ext';
    }
  })
})

onMounted(() => {
  AuthLogic.extensionInstalled()
    .then((installed) => {
      extensionInstalled.value = installed;
    })
    .catch((err) => {
      console.error(err);
    })
})

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
        v-for="option in getOptions"
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