<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores';
import type { IUser } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import UserCard from '@/components/UserCard.vue';

const user = ref<IUser | undefined>(undefined);
const loading = ref<boolean>(true);
const errorMessage = ref<string | undefined>(undefined);

onMounted(async () => {
  try {
    const route = useRoute();
    const userId: string = route.params.id as string;
    
    const userStore = useUserStore();
    user.value = await userStore.fetchSingleUser(userId);

  } catch (err) {
    errorMessage.value = (err as Error).message || 'Something went wrong';
  }

  loading.value = false;
})

</script>

<template>
  <base-page title="User">
    <v-row justify="center">
      <v-col
        v-if="errorMessage"
        cols="auto">
        <base-card>
          <p class="text-center">
            {{ errorMessage }}
          </p>
        </base-card>
      </v-col>

      <v-col
        v-if="loading"
        cols="auto">
        <base-card>
          <p class="text-center">
            Loading...
          </p>
        </base-card>
      </v-col>

      <v-col
        v-else-if="user"
        cols="auto">
        <user-card
          :user="user"
          :show-public-key="true"
          :show-thoughts="true" />
      </v-col>

      <v-col
        v-else
        cols="11"
        md="6">
        <base-card>
          <p class="text-center">
            It looks like the user you are looking for does not exist
          </p>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>
