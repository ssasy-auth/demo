import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginUser } from '@/logic';
import { useAuthStore } from '@/stores';
import type { Router } from 'vue-router';
import type { ActionItem } from '@/components/base/BaseCard.vue';

export const useNavStore = defineStore('nav', () => {
  
  const extensionInstalled = ref(false);

  const getAppOptions = computed<ActionItem[]>(() => {
    // define base options
    return [ 
      { label: 'thoughts', to: '/thoughts' },
      { label: 'users', to: '/users' }
    ];
  });

  const getAuthOptions = computed(() => {
    return (router: Router): ActionItem[] => {
      const authStore = useAuthStore();
 
      // define base options
      const baseOptions: ActionItem[] = [];

      // define auth options
      const authOptions: ActionItem[] = [
        { 
          label: 'login',
          color: 'grey',
          action: async () => {
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
    
        },
        { 
          label: 'register',
          color: 'grey',
          to: '/auth/register'
        }
      ]

      function _getUserOptions(user: any): ActionItem[] {
        return [
          { 
            label: `@${user.username}`, 
            color: 'secondary',
            to: '/profile'
          },
          { 
            label: 'logout',
            color: 'secondary',
            action: () => { 
              authStore.logout();
            } 
          }
        ]
      }

      function _getAuthOptions(extInstalled: boolean): ActionItem[] {
        return authOptions.filter(option => {
          if(extInstalled){
            return option.label !== 'download extension';
          } else {
            return option.label === 'download extension';
          }
        })
      }


      if(authStore.user){
        baseOptions.push(..._getUserOptions(authStore.user));
      } else {
        baseOptions.push(..._getAuthOptions(extensionInstalled.value));
      }

      return baseOptions;
    }
  });

  const getOptions = computed(() => {
    return (router: Router): ActionItem[] => {
      const baseOptions = getAppOptions.value;
      const authOptions = getAuthOptions.value(router);

      return [ ...baseOptions, ...authOptions ];
    }
  });

  function setExtensionInstalled(value: boolean){
    extensionInstalled.value = value;
  }

  return {
    extensionInstalled,
    getOptions,
    getAppOptions,
    getAuthOptions,
    setExtensionInstalled
  }
})

export const useSidebarStore = defineStore('sidebar', {
  state: () => ({
    visible: false
  }),
  actions: {
    toggle() {
      this.visible = !this.visible
    }
  }
})