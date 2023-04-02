import { ref, computed, onMounted } from 'vue'
import { Bridge } from '@ssasy-auth/extension';
import { loginUser } from '@/logic';
import { useAuthStore, useSidebarStore } from '@/stores';
import type { Router } from 'vue-router';
import type { ActionItem } from '@/components/base/BaseCard.vue'

export function useNavRoutes(router: Router) {
  const authStore = useAuthStore();
  const sidebarStore = useSidebarStore();

  const extensionInstalled = ref(false);


  const _options: ActionItem[] = [
    { label: 'Thoughts', icon:'mdi-message-outline', to: '/thoughts' },
    { label: 'Users', icon: 'mdi-account-group-outline', to: '/users' }
  ];
  
  const _authOptions: ActionItem[] = [
    { label: 'Login', icon:'mdi-key-outline', action: _loginUser },
    { label: 'Register', icon:'mdi-account-plus-outline', to: '/auth/register' }
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
    if(!extensionInstalled.value){
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

  function _updateExtensionStatus(status: boolean){
    extensionInstalled.value = status;
  }

  async function _loginUser(){
    try {
      const user = await loginUser();

      if(user){
        // redirect to profile page
        router.push('/profile');
      }

    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to login';
      throw new Error(errorMessage);
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
    // check if extension is installed
    const isInstalled = await Bridge.isExtensionInstalled();
    _updateExtensionStatus(isInstalled);
  });

  return { getAppOptions, getAuthOptions, getSystemOptions }
}