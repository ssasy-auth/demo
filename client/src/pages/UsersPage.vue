<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/UserCard.vue';

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
        md="6"
        v-for="user in userStore.users"
        :key="user.username">
        <user-card :user="user" />
      </v-col>
    </v-row>
  </base-page>
</template>
