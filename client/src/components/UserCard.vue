<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useThoughtStore } from '@/stores'
import type { IUser, IThought } from '@/stores'
import type { PropType } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import ThoughtCard from './ThoughtCard.vue'

const props = defineProps({
  // user object as IUser
  user: {
    type: Object as PropType<IUser>,
    required: true
  },

  showLink: {
    type: Boolean,
    default: false
  },

  showPublicKey: {
    type: Boolean,
    default: false
  },

  showThoughts: {
    type: Boolean,
    default: false
  }
})

const _thoughts = ref<IThought[]>([])
const thoughts = computed(() => {
  return _thoughts.value.map(thought => {
    return {
      ...thought,
      author: props.user
    }
  })
})

const readablePublicKey = computed(() => {
  // return formatted JSON string
  const string = JSON.stringify(props.user.credential.publicKey, null, 2)

  // remove empty lines at the beginning of the string
  return string.replace(/^\s*\n/gm, '')
})

const readableTimestamp = computed(() => {
  return dayjs((props.user as any).createdAt).format('DD/MM/YYYY')
})

onMounted(async () => {
  if (props.showThoughts) {
    // fetch thoughts
    const thoughtStore = useThoughtStore()
    _thoughts.value = await thoughtStore.fetchThoughtsByAuthor(props.user._id as string)
  }
})
</script>

<template>
  <base-card class="pa-1">
    <v-row
      justify="space-between"
      no-gutters>
      <v-col cols="6">
        <router-link
          v-if="props.showLink"
          class="hide-link"
          :to="`/users/${user._id}`">
          <b>@{{ user.username }}</b>
        </router-link>
        
        <b v-else>@{{ user.username }}</b>
      </v-col>

      <v-col
        cols="5"
        class="text-end">
        <small class="text-grey">
          joined {{ readableTimestamp }}
        </small>
      </v-col>
    </v-row>

    <div
      v-if="props.showPublicKey"
      class="mt-2">
      <pre class="user-public-key"><code>{{ readablePublicKey }}</code></pre>
      <v-list-item-subtitle> public key </v-list-item-subtitle>
    </div>
  </base-card>

  <v-row
    v-if="thoughts.length > 0"
    justify="center"
    class="mt-2">
    <v-col cols="auto">
      Thoughts
    </v-col>
    
    <v-divider class="border-opacity-0"/>

    <v-col
      v-for="thought in thoughts"
      :key="thought._id"
      cols="12">
      <thought-card
        :thought="thought"
        :disable-author-link="true" />
    </v-col>
  </v-row>
</template>

<style>
.user-public-key {
  overflow: auto;
}
</style>