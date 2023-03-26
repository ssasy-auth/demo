<script setup lang="ts">
import { computed } from 'vue'
import type { IUser } from '@/stores'
import type { PropType } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'

const props = defineProps({
  // user object as IUser
  user: {
    type: Object as PropType<IUser>,
    required: true
  }
})

const getJsonPublicKey = computed(() => {
  // return formatted JSON string
  const string = JSON.stringify(props.user.credential.publicKey, null, 2)

  // remove empty lines at the beginning of the string
  return string.replace(/^\s*\n/gm, '')
})
</script>

<template>
  <base-card class="pa-1">
    <div class="user-username">
      <v-list-item-title>
        {{ props.user.username }}
      </v-list-item-title>
      <v-list-item-subtitle> username </v-list-item-subtitle>
    </div>

    <div class="mt-2">
      <pre class="user-public-key"><code>{{ getJsonPublicKey }}</code></pre>
      <v-list-item-subtitle> public key </v-list-item-subtitle>
    </div>
  </base-card>
</template>

<style>
.user-public-key {
  overflow: auto;
}
</style>