<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/cards/UserCard.vue';
import MessageCard from '@/components/cards/MessageCard.vue';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUsers();
});
</script>

<template>
  <base-page title="Users">
    <v-row justify="center">
      <v-col
        cols="11"
        v-for="user in userStore.users"
        :key="user.username">
        <user-card
          :user="user"
          :show-link="true" />
      </v-col>

      <v-col
        v-if="userStore.users.length === 0"
        cols="11"
        md="6">
        <message-card message="No users yet" />
      </v-col>
    </v-row>
  </base-page>
</template>
