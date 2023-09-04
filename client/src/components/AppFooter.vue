<script setup lang="ts">
import { dependencies } from '../../package.json';

function getLatestSassyExtensionVersion(){
  const version = dependencies['@ssasy-auth/extension'];
  return version.replace('^', '');
}
</script>

<template>
  <v-footer
    app
    absolute>
    <v-row>
      <v-col>
        <a
          href="https://www.github.com/ssasy-auth"
          target="_blank"
          class="hide-link">
          <span class="mx-1">ssasy-demo &copy; 2023</span>
        </a>
      </v-col>
      <v-col>
        Requires <a
          href="https://www.ssasy.net/download"
          target="_blank"
          class="hide-link"><strong>SSASy Browser Extension</strong></a> v{{ getLatestSassyExtensionVersion() }}
      </v-col>
    </v-row>
  </v-footer>
</template>