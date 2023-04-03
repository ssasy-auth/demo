<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { registerUser } from '@/logic';
import { useNotification } from '@/composables';
import BasePage from '@/components/base/BasePage.vue';
import BaseBtn from '@/components/base/BaseBtn.vue';
import InputText from '@/components/base/InputText.vue';

const router = useRouter();
const { notify } = useNotification();

const username = ref<string|undefined>('');

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
      notify('Registration', 'Successfully registered user. Try logging in!', 'success');
      router.push('/');
    }

  } catch (err) {
    const message: string = (err as Error).message || 'Failed to register user';
    notify('Registration', message, 'error');
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
  </base-page>
</template>