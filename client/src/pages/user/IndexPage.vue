<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/UserCard.vue';
import BaseCard from '@/components/base/BaseCard.vue';

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
        md="7"
        v-for="user in userStore.users"
        :key="user.username">
        <user-card :user="user" />
      </v-col>

      <v-col
        v-if="userStore.users.length === 0"
        cols="11"
        md="6">
        <base-card>
          <p class="text-center">
            No users yet
          </p>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>
