<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bridge } from '@ssasy-auth/extension';
import BaseCard from '../base/BaseCard.vue';

const extensionInstalled = ref(false);

const getColor = computed<string>(() => {
  return extensionInstalled.value ? 'info' : 'warning';
});

const getWelcomeMessage = computed<string>(() => {
  return '<p>This the demo website for the <b>ssasy</b> browser extension and library.</p>';
});

onMounted(async () => {
  extensionInstalled.value = await Bridge.isExtensionInstalled();
});
</script>

<template>
  <base-card
    :outlined="false"
    :color="getColor"
    class="mt-2">
    <v-icon icon="mdi-information-outline" />
  
    <v-card-text v-if="extensionInstalled">
      <span v-html="getWelcomeMessage"></span>
      <br>
      <p>It looks like you have the <b>ssasy</b> extension installed.</p>
      <br>
      <p>Don't hesitate to <router-link to='/thoughts'>post</router-link> your feedback as a thought</p>
    </v-card-text>
    <v-card-text v-else>
      <span v-html="getWelcomeMessage"></span>
      <br>
      <p>In order to use this app, you need to have a firefox browser with the <b>ssasy</b> extension installed.</p>
      <br>
      <p>Visit the <a
        href="https://addons.mozilla.org/en-US/firefox/addon/ssasy/"
        target="_blank">firefox addons
        store</a> to download the extension.</p>
    </v-card-text>
  </base-card>
</template>
