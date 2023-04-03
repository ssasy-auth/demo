<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify/lib/framework.mjs';
import BasePage from '@/components/base/BasePage.vue';
import BaseCard from '@/components/base/BaseCard.vue';

const theme = useTheme();
const dark = ref<boolean>(theme.global.name.value === 'dark');

watch(dark, (value: boolean) => {
  theme.global.name.value = value ? 'dark' : 'light';
});

</script>

<template>
  <base-page title="Settings">
    <v-row justify="center">
      <v-col cols="11">
        <base-card>
          <v-card-title>Theme</v-card-title>

          <v-card-text>
            <v-row
              justify="space-between"
              align="center">
              <v-col
                cols="8"
                md="6">
                <p>Toggle between light and dark theme</p>
              </v-col>
              <v-col md="2">
                <v-switch
                  v-model="dark"
                  color="primary" />
              </v-col>
            </v-row>
          </v-card-text>
        </base-card>
      </v-col>
    </v-row>
  </base-page>
</template>
