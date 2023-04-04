<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';
import { useAuthStore, useExtensionStore } from '@/stores';
import { useNavRoutes } from '@/composables';
import AuthList from './AuthList.vue';

const router = useRouter();
const authStore = useAuthStore();
const extensionStore = useExtensionStore();
const { mdAndUp } = useDisplay();
const { getAppOptions, getAuthOptions, getSystemOptions } = useNavRoutes(router);
</script>

<template>
  <v-list color="primary">
    <v-list-item
      v-if="authStore.user"
      color="primary"
      class="nav-label"
      to="/profile">
      <template v-slot:prepend>
        <v-icon icon="mdi-account-box-outline"></v-icon>
      </template>
      <code>@{{ authStore.user.username }}</code>
    </v-list-item>

    <v-list-item
      v-for="option in getAppOptions"
      :key="option.label"
      :to="option.to"
      class="nav-label"
      @click="option.action">
      <template
        v-if="option.icon"
        v-slot:prepend>
        <v-icon :icon="option.icon"></v-icon>
      </template>

      {{ option.label }}
    </v-list-item>

    <v-list-item
      v-for="option in getSystemOptions"
      :key="option.label"
      :to="option.to"
      class="nav-label"
      @click="option.action">
      <template
        v-if="option.icon"
        v-slot:prepend>
        <v-icon :icon="option.icon"></v-icon>
      </template>

      {{ option.label }}
    </v-list-item>

    <v-list-item
      v-for="option in getAuthOptions"
      :key="option.label"
      :to="option.to"
      :class="`nav-label ${option.color ? `text-${option.color}` : ''}`"
      @click="option.action">
      <template
        v-if="option.icon"
        v-slot:prepend>
        <v-icon :icon="option.icon"></v-icon>
      </template>

      {{ option.label }}
    </v-list-item>

    <v-list-group
      v-if="!mdAndUp && !authStore.user && extensionStore.installed"
      class="nav-label">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-plus-outline"></v-icon>
          </template>
          Register
        </v-list-item>
      </template>

      <auth-list
        :outlined="false"
        :compact="true" />
    </v-list-group>
  </v-list>
</template>

<style scoped>
.nav-label {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>