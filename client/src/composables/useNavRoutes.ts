import { ref, computed, onMounted } from 'vue'
import { Bridge } from '@this-oliver/ssasy-ext';
import { loginUser } from '@/logic';
import { useAuthStore, useSidebarStore } from '@/stores';
import type { Router } from 'vue-router';
import type { IUser } from '@/stores';
import type { ActionItem } from '@/components/base/BaseCard.vue'

export function useNavRoutes(router: Router) {
  const authStore = useAuthStore();
  const sidebarStore = useSidebarStore();

  const extensionInstalled = ref(false);
  const user = computed<IUser | undefined>(() => authStore.user);

  const _appOptions: ActionItem[] = [
    { label: 'thoughts', icon:'mdi-message-outline', to: '/thoughts' },
    { label: 'users', icon: 'mdi-account-group-outline', to: '/users' }
  ];
  
  const _authOptions: ActionItem[] = [
    { label: 'login', action: _loginUser },
    { label: 'register', to: '/auth/register' }
  ]

  const _extensionOptions: ActionItem[] = [
    { label: 'download ssasy extension', action: _goToExtension }
  ]

  const _userOptions: ActionItem[] = [
    { label: `@${user.value?.username || 'not_available'}`, to: '/profile' },
    { label: 'logout', color: 'error', action: _logoutUser }
  ]

  const getAppOptions = computed<ActionItem[]>(() => {
    return _appOptions;
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

  return { getAppOptions, getAuthOptions }
}