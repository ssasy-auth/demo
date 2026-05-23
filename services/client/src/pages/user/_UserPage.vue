<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import { useNotification } from '@/composables';
import type { IUser } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/cards/UserCard.vue';
import MessageCard from '@/components/cards/MessageCard.vue';

const { notify } = useNotification();

const user = ref<IUser | undefined>(undefined);
const loading = ref<boolean>(true);

onMounted(async () => {
  try {
    const route = useRoute();
    const userId: string = route.params.id as string;

    const userStore = useUserStore();
    user.value = await userStore.fetchSingleUser(userId);

  } catch (err) {
    const message = (err as Error).message || 'Something went wrong';
    notify('User', message, 'error');
  }

  loading.value = false;
})

</script>

<template>
  <base-page title="User">
    <v-row justify="center">
      <v-col
        v-if="loading"
        cols="11"
        md="6">
        <message-card message="Loading..." />
      </v-col>

      <v-col
        v-else-if="user"
        cols="11">
        <user-card
          :user="user"
          :show-public-key="true"
          :show-thoughts="true" />
      </v-col>

      <v-col
        v-else
        cols="11"
        md="6">
        <message-card message="It looks like the user you are looking for does not exist" />
      </v-col>
    </v-row>
  </base-page>
</template>
