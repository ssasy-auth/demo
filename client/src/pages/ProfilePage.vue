<script setup lang="ts">
import { useAuthStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/cards/UserCard.vue';
import MessageCard from '@/components/cards/MessageCard.vue';

const authStore = useAuthStore();

</script>

<template>
  <base-page title="Profile">
    <v-row justify="center">
      <v-col
        v-if="authStore.user"
        cols="11">
        <user-card
          :user="authStore.user"
          :show-thoughts="true"
          :show-public-key="true" />
      </v-col>

      <v-col
        v-else
        cols="11"
        md="6">
        <message-card message="No users yet" />
      </v-col>
    </v-row>
  </base-page>
</template>
