<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useDisplay } from 'vuetify'
import { useSidebarStore, useAuthStore } from '@/stores'
import { ExtensionMessenger } from '@/logic';
import type { RawKey } from '@this-oliver/ssasy'
import BaseBtn from './base/BaseBtn.vue';
import AppLogo from './AppLogo.vue';

const authStore = useAuthStore();
const drawerStore = useSidebarStore();
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
    action: async () => {
      console.log('login');

      // get public key from extension
      const publicKey: RawKey | null = await ExtensionMessenger.getUserPublicKey('login');

      if(!publicKey){
        return alert('did not receive a public key :(')
      }

      // send public key to server and get challenge
      const challengeCiphertext = await authStore.getChallenge(publicKey);

      // get solution for challenge from extension
      const solution = await ExtensionMessenger.getSolution('login', challengeCiphertext);

      if(!solution){
        return alert('did not receive a solution :(')
      }

      // send solution to server for verification
      const verified = await authStore.verifyChallenge(solution);
      alert(verified ? 'verified!' : 'not verified!');
    } 
  },
  { 
    label: 'register',
    action: async () => {
      console.log('register')

      // get public key from extension
      const publicKey: RawKey | null = await ExtensionMessenger.getUserPublicKey('registration');

      if(!publicKey){
        return alert('did not receive a public key :(')
      }

      // get challenge from server
      const challengeCiphertext = await authStore.getChallenge(publicKey, { inRegistration: true });

      // get solution for challenge from extension
      const solution = await ExtensionMessenger.getSolution('registration', challengeCiphertext);

      if(!solution){
        return alert('did not receive a solution :(')
      }

      // send solution to server for verification
      const verified = await authStore.verifyChallenge(solution, { inRegistration: true });
      alert(verified ? 'verified!' : 'not verified!');
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
  ExtensionMessenger.extensionInstalled()
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
      @click="drawerStore.toggle" />

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