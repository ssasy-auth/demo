<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useRouter } from 'vue-router';
import { useAuthStore, useExtensionStore, useSidebarStore } from '@/stores';
import { useNotification } from '@/composables';
import { loginUser } from '@/logic';
import BaseBtn from '@/components/base/BaseBtn.vue';
import InputTextVue from '@/components/base/InputText.vue';
import AuthList from '@/components/lists/AuthList.vue';
import type { ActionItem } from '@/components/base/BaseCard.vue'
import BaseCard from '@/components/base/BaseCard.vue';

const router = useRouter();
const authStore = useAuthStore();
const sidebarStore = useSidebarStore();
const extensionStore = useExtensionStore();
const { mdAndUp } = useDisplay();
const { notify } = useNotification();

const username = ref<string>('');
const openLoginDialog = ref<boolean>(false);

const getAppOptions = computed<ActionItem[]>(() => {
  return [
    { label: 'Thoughts', icon:'mdi-message-outline', to: '/thoughts' },
    { label: 'Users', icon: 'mdi-account-group-outline', to: '/users' }
  ]
});

const getSystemOptions = computed<ActionItem[]>(() => {
  return [
    { label: 'Settings', icon:'mdi-cog-outline', to: '/settings' }
  ]
});

const getAuthOptions = computed<ActionItem[]>(() => {
  const authOptions: ActionItem[] = extensionStore.installed 
    ? [ { label: 'Login', icon:'mdi-key-outline', action: () => openLoginDialog.value = true } ]
    : [ { label: 'Login', icon:'mdi-key-outline', to: '/start' } ]

  const userOptions: ActionItem[] = [ { label: 'Logout', icon:'mdi-logout', color: 'error', action: _logoutUser } ]

  return authStore.user 
    ? userOptions
    : authOptions;
});

async function _loginUser(username: string){
  console.log(`logging in ${username}`)
  try {
    const user = await loginUser(username);

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

  if(router.currentRoute.value.path === '/profile'){
    router.push('/');
  }

  // close sidebar
  sidebarStore.visible = false;
}
</script>

<template>
  <div>
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

    <v-dialog
      v-model="openLoginDialog"
      max-width="500px">
      <v-sheet class="pa-1">
        <base-card>
          <v-card-title>
            Enter username
          </v-card-title>
          
          <input-text-vue
            v-model="username"
            class="mt-1"
            label="Username"
            @enter="_loginUser(username)" />
        
          <base-btn
            class="mt-1"
            @click="_loginUser(username)">
            Login
          </base-btn>
        </base-card>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<style scoped>
.nav-label {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>