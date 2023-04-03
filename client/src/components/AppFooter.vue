<script setup lang="ts">
import BaseImage from './base/BaseImage.vue';
import LogoImage from '@/assets/images/ssasy-logo.svg';
</script>

<template>
  <v-footer app>
    <span class="mx-1">&copy; ssasy-demo</span>

    <v-spacer />
    
    <a
      href="https://www.github.com/ssasy-auth"
      target="_blank"
      class="hide-link">
      <base-image
        :src="LogoImage"
        alt="ssasy logo"
        height="20px"
        class="mx-1"/>
    </a>
  </v-footer>
</template>