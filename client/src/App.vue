<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterView } from 'vue-router'
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { Bridge } from '@ssasy-auth/extension';
import { useAuthStore, useExtensionStore } from '@/stores';
import AppNav from '@/components/AppNav.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppNotification from '@/components/AppNotification.vue';
import AppFooter from '@/components/AppFooter.vue';
import AuthList from '@/components/lists/AuthList.vue';
import NavList from '@/components/lists/NavList.vue';
import DemoCard from '@/components/cards/DemoCard.vue';

const authStore = useAuthStore();
const extensionStore = useExtensionStore();

const isDesktop = computed(() => {
  const { name } = useDisplay();
  return name.value === 'md' || name.value === 'lg' || name.value === 'xl';
});

onMounted(async () => {
  if(!extensionStore.installed){
    extensionStore.installed = await Bridge.isExtensionInstalled();
  }
});
</script>

<template>
  <v-app>
    <app-nav />
    <app-sidebar v-if="!isDesktop" />
    
    <v-main>
      <app-notification />
      <v-container>
        <v-row :justify="isDesktop ? 'space-between' : 'center'">
          <!-- left bar -->
          <v-col
            v-if="isDesktop"
            cols="3"
            order="3"
            order-md="1"
            class="mt-md-16">
            <nav-list />
          </v-col>

          <!-- center bar -->
          <v-col
            md="6"
            order="2">
            <router-view />
          </v-col>

          <!-- right bar -->
          <v-col
            cols="11"
            md="3"
            order="1"
            order-md="3"
            class="mt-md-16">
            <demo-card />

            <auth-list
              v-if="isDesktop && !authStore.user"
              class="mt-2"/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <app-footer />
  </v-app>
</template>
