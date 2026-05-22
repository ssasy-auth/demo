<script setup lang="ts">
import dayjs from 'dayjs'
import { ref, computed, onMounted } from 'vue'
import { useThoughtStore } from '@/stores'
import BaseCard from '@/components/base/BaseCard.vue'
import ThoughtCard from '@/components/cards/ThoughtCard.vue'
import type { PropType } from 'vue'
import type { IUser, IThought } from '@/stores'

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

const readablePublicKey = computed<string>(() => {
  let publicKey: string = props.user.credential.publicKey;

  // get rid of the first part of the key (the part before the "?")
  publicKey = publicKey.slice(publicKey.indexOf('?') + 1)

  // represent key as an object
  publicKey = publicKey.split('&').reduce((acc, curr) => {
    const [ key, value ] = curr.split('=')

    // ignore the key_ops property
    if(key === 'c_key_ops') {
      return acc
    }
    
    return {
      ...acc,
      [key]: value
    }
  }, {} as any)

  return publicKey
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
      align="center"
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

  <base-card
    v-if="props.showPublicKey"
    color="warning"
    :flat="true"
    :outlined="false"
    class="mt-2">
    <v-row no-gutters>
      <v-col cols="1">
        <v-icon icon="mdi-information-outline" />
      </v-col>
      <v-col>
        <p>
          The card above represents a <b>public key</b> which you can think of as the address to your home while the <b>private key</b> is the key to your home. You can share your address with anyone but unless they have the key to your home, they can't enter it. The same goes for the public key, it is safe to share it with anyone because it does not contain any sensitive information like
          your <b>private key</b>.
        </p>
      </v-col>
    </v-row>
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