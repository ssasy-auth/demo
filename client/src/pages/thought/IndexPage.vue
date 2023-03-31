<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStatusStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import InputTextArea from '@/components/base/InputTextArea.vue';
import ThoughtCard from '@/components/ThougtCard.vue';
import type { ActionItem } from '@/components/base/BaseCard.vue';

const thoughtStore = useStatusStore();

const form = ref<string>('');

const validForm = computed<boolean>(() => {
  return form.value.length > 0;
});

const actions: ActionItem[] = [
  {
    label: 'Post',
    color: 'primary',
    disabled: !validForm.value,
    action: postStatus
  }
];

async function postStatus() {
  await thoughtStore.postStatus(form.value);
  form.value = '';
}

onMounted(() => {
  thoughtStore.fetchThoughts();
});
</script>

<template>
  <base-page title="Thoughts">
    <v-row justify="center">
      <v-col
        cols="11"
        md="7">

        <base-card :actions="actions">
          <input-text-area
            v-model="form"
            place-holder="What's on your mind?" />
        </base-card>
        
      </v-col>

      <v-divider class="border-opacity-0" />

      <v-col
        cols="11"
        md="7"
        v-for="thought in thoughtStore.thoughts"
        :key="thought._id">
        <thought-card :thought="thought" />
      </v-col>

      <v-col
        v-if="thoughtStore.thoughts.length === 0"
        cols="11"
        md="6">
        <base-card>
          <p class="text-center">
            No thoughts yet
          </p>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>