import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { loginUser } from '@/logic';
import { useAuthStore } from '@/stores';
import type { Router } from 'vue-router';
import type { ActionItem } from '@/components/base/BaseCard.vue';

export const useNavStore = defineStore('nav', () => {
  
  const extensionInstalled = ref(false);

  const getOptions = computed(() => {
    return (router: Router): ActionItem[] => {
      // define base options
      const options: ActionItem[] = [ { label: 'users', to: '/users' } ];

      // define auth options
      const authOptions: ActionItem[] = [
        { 
          label: 'download extension',
          color: 'grey',
          to: '/download'
        },
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
              const authStore = useAuthStore();
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
      
      const authStore = useAuthStore();
      const user = authStore.user;

      if(user){
        options.push(..._getUserOptions(user));
      } else {
        options.push(..._getAuthOptions(extensionInstalled.value));
      }

      return options;
    }
  });

  function setExtensionInstalled(value: boolean){
    extensionInstalled.value = value;
  }

  return {
    extensionInstalled,
    getOptions,
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