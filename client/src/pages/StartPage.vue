<script setup lang="ts">
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import MessageCard from '@/components/cards/MessageCard.vue';

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: 'Download extension',
    description: 'Visit <a href="https://www.ssasy.net" target="_blank">www.ssasy.net</a> to download the extension on a supported browser.'
  },
  {
    title: 'Setup your wallet',
    description: 'Click the extension icon and follow the instructions to setup your account.'
  },
  {
    title: 'Register',
    description: 'Create an account on this website.'
  },
  {
    title: 'Login',
    description: 'Login to this website using the extension.'
  },
  {
    title: 'Post a thought',
    description: 'Post a thought about what you think about this demo.'
  }
]

const note: string = '<i>If you find any bugs or have any feedback, please <router-link to="/thought">post your thoughts</router-link> in this demo or <a href="https://github.com/ssasy-auth/demo/issues/new" target="_blank">leave a comment</a> on github. Thank you in advance!</i>'

</script>

<template>
  <base-page title="Getting Started">
    <v-row justify="center">
      <v-col
        cols="8"
        md="12">
        <p>
          This is a demo application for the <b><code>ssasy</code></b> browser extension and library. In order to experience the
          extension to its fullest, follow the steps below:
        </p>
      </v-col>

      <v-divider class="border-opacity-0" />

      <v-col
        v-for="step, index in steps"
        :key="step.title"
        cols="8"
        md="6">
        <base-card class="hint-card">
          <div class="hint-title">{{ index+1 }}. {{ step.title }}</div>
          <v-card-text>
            <div v-html="step.description"></div>
          </v-card-text>
        </base-card>
      </v-col>

      <v-col
        cols="8"
        md="6">
        <message-card
          :message="note"
          html-ish
          color="secondary"
          class="hint-card"/>
      </v-col>
    </v-row>
  </base-page>
</template>

<style>
.hint-card {
  height: 100px;
}

.hint-card .hint-title {
  font-size: 1.15rem;
  font-weight: lighter;
  overflow-wrap: break-word;
}

/* desktop screens */
@media (min-width: 960px) {
  .hint-card {
    height: 175px;
  }
  
  .hint-card .hint-title {
    font-size: 1.15rem;
  }
}
</style>