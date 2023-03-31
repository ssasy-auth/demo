<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';
import { useNavRoutes } from '@/composables';

const router = useRouter();
const authStore = useAuthStore();
const { getAppOptions, getAuthOptions } = useNavRoutes(router);
</script>

<template>
  <v-list color="primary">
    <v-list-item
      v-if="authStore.user"
      color="primary"
      class="nav-label">
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
      v-for="option in getAuthOptions"
      :key="option.label"
      :to="option.to"
      :class="`nav-label text-${option.color || undefined}`"
      @click="option.action">
      <template
        v-if="option.icon"
        v-slot:prepend>
        <v-icon :icon="option.icon"></v-icon>
      </template>
        
      {{ option.label }}
    </v-list-item>
  </v-list>
</template>

<style scoped>
.nav-label {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>