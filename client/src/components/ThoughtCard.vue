<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import type { PropType } from 'vue'
import type { IThought } from '@/stores'
import BaseCard from '@/components/base/BaseCard.vue'

const props = defineProps({
  thought: {
    type: Object as PropType<IThought>,
    required: true
  },

  disableAuthorLink: {
    type: Boolean,
    default: false
  }
})

const humanReadableDate = computed<string>(() => {
  return dayjs(props.thought.createdAt).format('MMM D, YYYY')
})
</script>

<template>
  <base-card class="pa-1">
    <v-row
      justify="space-between"
      no-gutters>
      <v-col cols="6">
        <b v-if="props.disableAuthorLink">@{{ thought.author.username }}</b>
        
        <router-link
          v-else
          class="hide-link"
          :to="`/users/${thought.author._id}`">
          <b>@{{ thought.author.username }}</b>
        </router-link>
      </v-col>

      <v-col
        cols="4"
        class="text-end">
        <small class="text-grey">
          {{ humanReadableDate }}
        </small>
      </v-col>
    </v-row>

    <span class="mt-2">
      {{ props.thought.text }}
    </span>
  </base-card>
</template>
