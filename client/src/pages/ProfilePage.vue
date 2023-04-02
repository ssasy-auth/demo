<script setup lang="ts">
import { useAuthStore } from '@/stores';
import BasePage from '@/components/base/BasePage.vue';
import UserCard from '@/components/cards/UserCard.vue';
import BaseCard from '@/components/base/BaseCard.vue';

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
          :show-public-key="true"/>
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
