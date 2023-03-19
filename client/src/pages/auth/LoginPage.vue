<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { loginUser } from '@/logic';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseBtn from '@/components/base/BaseBtn.vue';

const router = useRouter();
const error = ref<string|undefined>(undefined);


async function login(){
  try {
    const user = await loginUser();

    if(user){
      alert('login successful!');
    }

    // redirect to landing page
    router.push('/');

  } catch (err) {
    const errorMessage = (err as Error).message || 'Failed to login';
    error.value = errorMessage;
  }
}
</script>

<template>
  <base-page title="Login">
    <v-row
      justify="center"
      style="padding-top: 50px;">
      <v-col
        cols="11"
        md="auto">
        <base-card>
          <p class="text-center">
            Login to your account using the SSASy extension
          </p>
        </base-card>
      </v-col>
      
      <v-divider class="border-opacity-0 mt-2" />
      
      <v-col
        cols="11"
        md="auto">
        <base-btn
          large
          color="secondary"
          @click="login">Login</base-btn>
      </v-col>
      <v-divider
        v-if="error"
        class="border-opacity-0 mt-2" />
      <v-col
        v-if="error"
        cols="11"
        md="auto">
        <base-card class="pa-2">
          <p class="text-center">
            {{ error }}
          </p>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>

<style scoped>
#login-page {
  padding-top: 500px;
}
</style>