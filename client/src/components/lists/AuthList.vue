<script setup lang="ts">
import type { ActionItem } from '../base/BaseCard.vue';
import BaseCard from '../base/BaseCard.vue';
import BaseImage from '../base/BaseImage.vue';
import SsasyLogo from '@/assets/images/ssasy-logo.svg';
import BrandAppleImage from '@/assets/images/brand-apple.svg';
import BrandGoogleImage from '@/assets/images/brand-google.svg';
import BrandTwitterImage from '@/assets/images/brand-twitter.svg';

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: true
  }
});

interface Brand extends ActionItem {
  image: string;
}
const brands: Brand[] = [
  { label: 'ssasy', image: SsasyLogo, to: '/auth/register' },
  { label: 'Apple', image: BrandAppleImage, disabled: true },
  { label: 'Google', image: BrandGoogleImage, disabled: true },
  { label: 'Twitter', image: BrandTwitterImage, disabled: true }
]
</script>

<template>
  <base-card :outlined="props.outlined">
    <v-card-title v-if="!props.compact">
      New to <b>Thoughts</b>?
    </v-card-title>
    <v-list
      color="primary"
      class="mt-2">
      <v-list-item
        v-for="brand in brands"
        :key="brand.label"
        :to="brand.to"
        :disabled="brand.disabled"
        rounded="xl"
        :class="`nav-label ${brand.color ? `text-${brand.color}` : ''}`"
        @click="brand.action">
        <template v-slot:prepend>
          <base-image
            :src="brand.image"
            :alt="`${brand.label} logo`"
            :height="brand.disabled ? 20 : 24"
            class="mr-2" />
        </template>

        <span v-if="!props.compact">Register with</span> {{ brand.label }}
      </v-list-item>
    </v-list>
  </base-card>
</template>

<style scoped>
.nav-label {
  font-weight: bold;
  font-size: 0.95rem;
}

.strike {
  text-decoration: line-through;
}
</style>