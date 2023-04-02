<script setup lang="ts">
import BaseImage from './base/BaseImage.vue';
import LogoImage from '@/assets/images/ssasy-logo.svg';
</script>

<template>
  <v-footer app>
    <span class="mx-1">&copy; ssasy</span>

    <v-spacer />
    
      <base-image
      :src="LogoImage"
      alt="ssasy logo"
      height="20px"
      class="mx-1"/>
  </v-footer>
</template>