<script setup lang="ts">
import { useAuthStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/UserCard.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const authStore = useAuthStore();

</script>

<template>
  <base-page title="Profile">
    <v-row justify="center">
      <v-col
        v-if="authStore.user"
        cols="auto">
        <user-card :user="authStore.user" />
      </v-col>

      <v-col
        v-else
        cols="11"
        md="6">
        <base-card>
          <p class="text-center">
            It looks like you're not logged in
          </p>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>
