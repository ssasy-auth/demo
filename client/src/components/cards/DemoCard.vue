<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Bridge } from '@ssasy-auth/extension';
import { useExtensionStore } from '@/stores';
import BaseCard from '../base/BaseCard.vue';

const extensionStore = useExtensionStore();

const getColor = computed<string>(() => {
  return extensionStore.installed ? 'info' : 'warning';
});

const getWelcomeMessage = computed<string>(() => {
  return '<p>This the demo website for the <b>ssasy</b> browser extension and library.</p>';
});

onMounted(async () => {
  if(extensionStore.installed) return;

  extensionStore.installed = await Bridge.isExtensionInstalled();
});
</script>

<template>
  <base-card
    :outlined="false"
    :color="getColor"
    class="mt-2">
    <v-icon icon="mdi-information-outline" />
  
    <v-card-text v-if="extensionStore.installed">
      <span v-html="getWelcomeMessage"></span>
      <br>
      <p>It looks like you have the <b>ssasy</b> extension installed.</p>
      <br>
      <p>Don't hesitate to <router-link to='/thoughts'>post</router-link> your feedback as a thought</p>
    </v-card-text>
    <v-card-text v-else>
      <span v-html="getWelcomeMessage"></span>
      <br>
      <p>Visit <a
        href="https://www.ssasy.net"
        target="_blank">www.ssasy.net</a> to download the extension on a supported browser.</p>
    </v-card-text>
  </base-card>
</template>
