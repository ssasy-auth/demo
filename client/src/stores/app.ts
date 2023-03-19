import { toRaw } from 'vue';
import { defineStore } from 'pinia'
import { useUserStore } from '@/stores';
import type { ActionItem } from '@/components/base/BaseCard.vue';

const baseOptions: ActionItem[] = [
  { label: 'users', to: '/users' }
]

const authOptions: ActionItem[] = [
  { 
    label: 'install ext',
    color: 'secondary',
    action: () => {
      console.log('install ext');
    } 
  },
  { 
    label: 'login',
    color: 'secondary',
    to: '/auth/login'
    
  },
  { 
    label: 'register',
    color: 'secondary',
    to: '/auth/register'
  }
]

function getAuthOptions(extInstalled: boolean): ActionItem[] {
  return authOptions.filter(option => {
    if(extInstalled){
      return option.label !== 'install ext';
    } else {
      return option.label === 'install ext';
    }
  })
}

function getUserOptions(user: any): ActionItem[] {
  return [
    { label: user.username, action: () => { console.log({ publicKey: toRaw(user.publicKey) }) } },
    { 
      label: 'logout', 
      action: () => { 
        const userStore = useUserStore();
        userStore.resetStore()
      } 
    }
  ]
}

export const useNavStore = defineStore('nav', {
  state: () => ({
    extensionInstalled: false
  }),
  getters: {
    getOptions: (state) => {
      // define base options
      const options: ActionItem[] = [ ...baseOptions ];
      
      const userStore = useUserStore();
      
      if(userStore.user){
        const userOptions = getUserOptions(userStore.user);
        options.push(...userOptions);
      } else {
        const authOptions = getAuthOptions(state.extensionInstalled);
        options.push(...authOptions);
      }

      return options;
    }
  },
  actions: {
    setExtensionInstalled(value: boolean){
      this.extensionInstalled = value;
    }
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