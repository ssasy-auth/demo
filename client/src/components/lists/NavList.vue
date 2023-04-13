<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { Bridge } from '@ssasy-auth/extension';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';
import { useAuthStore, useExtensionStore, useSidebarStore } from '@/stores';
import { useNotification } from '@/composables';
import { loginUser } from '@/logic';
import type { ActionItem } from '@/components/base/BaseCard.vue'
import AuthList from './AuthList.vue';

const router = useRouter();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore();
const extensionStore = useExtensionStore();
const { mdAndUp } = useDisplay();
const { notify } = useNotification();

const _options = computed<ActionItem[]>(() => {
  return [
    { label: 'Thoughts', icon:'mdi-message-outline', to: '/thoughts' },
    { label: 'Users', icon: 'mdi-account-group-outline', to: '/users' }
  ]
});
  
const _authOptions = computed<ActionItem[]>(() => {
  return extensionStore.installed 
    ? [ 
      { label: 'Login', icon:'mdi-key-outline', action: _loginUser } 
    ]
    : [ 
      { label: 'Login', icon:'mdi-key-outline', to: '/start' } 
    ]
});

const _userOptions = computed<ActionItem[]>(() => {
  return [
    { label: 'Logout', icon:'mdi-logout', color: 'error', action: _logoutUser }
  ]
});

const _systemOptions = computed<ActionItem[]>(() => {
  return [
    { label: 'Settings', icon:'mdi-cog-outline', to: '/settings' }
  ]
});

const getAppOptions = computed<ActionItem[]>(() => {
  return _options.value;
});

const getSystemOptions = computed<ActionItem[]>(() => {
  return _systemOptions.value;
});

const getAuthOptions = computed<ActionItem[]>(() => {
  return authStore.user ? _userOptions.value : _authOptions.value;
});

async function _loginUser(){
  try {
    const user = await loginUser();

    if(user){
      notify('Login', 'Successfully logged in', 'success');
        
      // redirect to profile page
      router.push('/profile');
    }

  } catch (err) {
    const errorMessage = (err as Error).message || 'Failed to login';
    notify('Login', errorMessage, 'error')
  }
}

async function _logoutUser(){
  authStore.logout();

  // close sidebar
  sidebarStore.visible = false;
}

onMounted(async () => {
  if(!extensionStore.installed){
    // check if extension is installed
    extensionStore.installed = await Bridge.isExtensionInstalled();
  }
});
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

    <div
      v-for="option in getAuthOptions"
      :key="option.label">
      <template v-if="option.to">
        <v-list-item
          :to="option.to"
          :class="`nav-label ${option.color ? `text-${option.color}` : ''}`">
          <template
            v-if="option.icon"
            v-slot:prepend>
            <v-icon :icon="option.icon"></v-icon>
          </template>

          {{ option.label }}
        </v-list-item>
      </template>

      <template v-else>
        <v-list-item
          :class="`nav-label ${option.color ? `text-${option.color}` : ''}`"
          @click="option.action">
          <template
            v-if="option.icon"
            v-slot:prepend>
            <v-icon :icon="option.icon"></v-icon>
          </template>

          {{ option.label }}
        </v-list-item>
      </template>
    </div>

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