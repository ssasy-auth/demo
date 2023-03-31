<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '@/logic';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseBtn from '@/components/base/BaseBtn.vue';
import InputText from '@/components/base/InputText.vue';

const router = useRouter();
const username = ref<string|undefined>('');
const error = ref<string|undefined>(undefined);

const isValidUsername = computed(() => {
  if(!username.value){
    return undefined;
  }

  return username.value?.length >= 3;
});

async function register(){
  try {
    const user = await registerUser(username.value as string);
    
    if(user){
      // redirect to landing page
      router.push('/auth/login');
    }

  } catch (err) {
    const message: string = (err as Error).message || 'Failed to register user';
    error.value = message;
  }
}
</script>

<template>
  <base-page title="Register">
    <v-sheet
      color="grey-lighten-3"
      rounded="lg">
      <v-row
        justify="center"
        style="padding-top: 50px;">
        <v-col
          cols="11"
          class="text-center">
        </v-col>

        <v-col cols="11">
          <input-text
            v-model="username"
            label="Enter username..."
            :is-valid="isValidUsername" />
        </v-col>
      
        <v-divider class="border-opacity-0" />
      
        <v-col cols="auto">
          <base-btn
            large
            @click="register"
            :disabled="!isValidUsername">Register</base-btn>
        </v-col>
      </v-row>
    </v-sheet>

    <v-row
      justify="center"
      style="padding-top: 50px;">
      
      <v-divider
        v-if="error"
        class="border-opacity-0 mt-2" />
      
      <v-col
        v-if="error"
        cols="11"
        md="6">
        <base-card class="pa-2">
          <p class="text-center">
            {{ error }}
          </p>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>