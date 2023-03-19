<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue';

interface Steps {
  title: string;
  description: string;
  icon?: string;
  color?: string;
  emoji?: string;
}

const steps: Steps[] = [
  { title: 'Setup wallet', description: 'Install the SSASy extension and setup your wallet' },
  { title: 'Register', description: 'Register your account using the SSASy extension' },
  { title: 'Login', description: 'Login to your account using the SSASy extension' },
  { title: 'Enjoy', description: 'You no longer need to remember a gazillion passwords! Just use SSASy!' }
]

</script>

<template>
  <base-page>
    <v-row
      justify="center"
      class="billboard">
      <v-col
        cols="11"
        md="auto">
        <h1 class="text-center">Say hello to self-sovereign authentication</h1>
        <h2 class="text-center">...and goodbye to federated identities!</h2>
      </v-col>
    </v-row>

    <v-list>
      <v-list-item
        v-for="(step, index) in steps"
        :key="step.title"
        class="text-center pa-1 mt-1">
        <v-list-item-title>
          <h3 >
            {{ index + 1 }}.
            {{ step.title }}
          </h3>
        </v-list-item-title>
        <p>
          {{ step.description }}
        </p>
        
      </v-list-item>
    </v-list>
  </base-page>
</template>

<style>
.billboard {
  padding: 100px 0;
}
</style>