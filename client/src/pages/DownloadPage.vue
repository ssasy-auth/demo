<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseImageVue from '@/components/base/BaseImage.vue';
import LogoFirefox from '@/assets/images/logo-firefox.svg';
import LogoChrome from '@/assets/images/logo-chrome.svg';
import LogoSafari from '@/assets/images/logo-safari.svg';
import LogoExplorer from '@/assets/images/logo-explorer.svg';
import LogoBrave from '@/assets/images/logo-brave.svg';

interface BrowserItem {
  name: string;
  url: string;
  brand?: string;
}

const browsers: BrowserItem[] = [
  { name: 'Firefox', url: 'https://addons.mozilla.org/en-US/firefox/addon/ssasy', brand: LogoFirefox },
  { name: 'Chrome', url: '#', brand: LogoChrome },
  { name: 'Safari', url: '#', brand: LogoSafari },
  { name: 'Explorer', url: '#', brand: LogoExplorer },
  { name: 'Brave', url: '#', brand: LogoBrave }
]

</script>

<template>
  <base-page title="Download">
    <v-row justify="center">
      <v-col
        cols="11"
        md="6">
        <base-card>
          <p class="text-center">
            Visit your browser's extension store and install the SSASy extension to get started!
          </p>
        </base-card>
      </v-col>

      <v-divider class="border-opacity-0 mt-2" />

      <v-col
        v-for="browser in browsers"
        :key="browser.name"
        cols="11"
        md="3">
        <a
          :href="browser.url"
          :target="browser.url === '#' ? undefined : '_blank'"
          class="hide-link">
          <base-card
            :color="browser.url === '#' ? 'grey' : 'primary'"
            class="text-center">
            <base-image-vue
              v-if="browser.brand"
              :src="browser.brand"
              :alt="`${browser.name} logo`"
              height="100px"/>

            <v-card-title>
              {{ browser.name }}
            </v-card-title>
            <v-card-subtitle>
              <span v-if="browser.url === '#'"><b>Coming soon</b></span>
              <span v-else>Install</span>
            </v-card-subtitle>
          </base-card>
        </a>
      </v-col>
    </v-row>
  </base-page>
</template>
