import { computed, onMounted } from 'vue'
import { Bridge } from '@ssasy-auth/extension';
import { loginUser } from '@/logic';
import { useAuthStore, useSidebarStore, useExtensionStore } from '@/stores';
import { useNotification } from './useNotification';
import type { Router } from 'vue-router';
import type { ActionItem } from '@/components/base/BaseCard.vue'

export function useNavRoutes(router: Router) {
  const authStore = useAuthStore();
  const sidebarStore = useSidebarStore();
  const extensionStore = useExtensionStore();
  const { notify } = useNotification();


  const _options: ActionItem[] = [
    { label: 'Thoughts', icon:'mdi-message-outline', to: '/thoughts' },
    { label: 'Users', icon: 'mdi-account-group-outline', to: '/users' }
  ];
  
  const _authOptions: ActionItem[] = [
    { label: 'Login', icon:'mdi-key-outline', action: _loginUser }
  ]

  const _extensionOptions: ActionItem[] = [
    { label: 'Download ssasy extension', icon: 'mdi-download-box-outline', action: _goToExtension }
  ]

  const _userOptions: ActionItem[] = [
    { label: 'Logout', icon:'mdi-logout', color: 'error', action: _logoutUser }
  ]

  const _systemOptions: ActionItem[] = [
    { label: 'Settings', icon:'mdi-cog-outline', to: '/settings' }
  ]

  const getAppOptions = computed<ActionItem[]>(() => {
    return _options;
  });

  const getAuthOptions = computed<ActionItem[]>(() => {
    if(!extensionStore.installed){
      return _extensionOptions;
    }

    else if (authStore.user){
      return _userOptions;
    }

    else {
      return _authOptions;
    }
  });

  const getSystemOptions = computed<ActionItem[]>(() => {
    return _systemOptions;
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

  async function _goToExtension(){
    const extensionUrl = 'https://addons.mozilla.org/en-GB/firefox/addon/ssasy/';
    
    // open extension url in new tab
    window.open(extensionUrl, '_blank');
  }

  onMounted(async () => {
    if(!extensionStore.installed){
      // check if extension is installed
      extensionStore.installed = await Bridge.isExtensionInstalled();
    }
  });

  return { getAppOptions, getAuthOptions, getSystemOptions }
}