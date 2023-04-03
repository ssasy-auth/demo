<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAuthStore, useThoughtStore } from '@/stores';
import { useNotification } from '@/composables';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import InputTextArea from '@/components/base/InputTextArea.vue';
import ThoughtCard from '@/components/cards/ThoughtCard.vue';
import MessageCard from '@/components/cards/MessageCard.vue';
import type { ActionItem } from '@/components/base/BaseCard.vue';

const authStore = useAuthStore();
const thoughtStore = useThoughtStore();
const { notify } = useNotification();

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
  if (!validForm.value) {
    const message = '<p>A thought must be at least 1 character long. Add more characters and try again.</p>';
    notify('Thought', message, 'warning');
    return;
  }

  if (!authStore.user) {
    const message = '<p>You must be logged in to post a thought. Please login or <a href="/auth/register">register</a> and try again.</p>';
    notify('Thought', message, 'warning');
    return;
  }

  try {
    await thoughtStore.postThought(form.value);
    form.value = '';
  } catch (error) {
    const message = (error as Error).message || 'Failed to post thought. Please try again later.';
    notify('Thought', message, 'error');
  }
}

onMounted(() => {
  thoughtStore.fetchThoughts();
});
</script>

<template>
  <base-page title="Thoughts">
    <v-row justify="center">
      <v-col cols="11">

        <base-card :actions="actions">
          <input-text-area
            v-model="form"
            place-holder="What's on your mind?" />
        </base-card>

      </v-col>

      <v-divider class="border-opacity-0" />

      <v-col
        cols="11"
        v-for="thought in thoughtStore.thoughts"
        :key="thought._id">
        <thought-card :thought="thought" />
      </v-col>

      <v-col
        v-if="thoughtStore.thoughts.length === 0"
        cols="11"
        md="6">
        <message-card message="No thoughts yet" />
      </v-col>
    </v-row>
  </base-page>
</template>