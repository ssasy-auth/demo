import { defineStore } from 'pinia'
import { storage } from '@/logic';
import { fetchApi } from '@/util';
import type { RawKey } from '@this-oliver/ssasy'

const KEY_STORAGE_USER = 'ssasy-demo-user';

export interface IUser {
  id?: string;
  publicKey: RawKey;
  username: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: storage.getItem(KEY_STORAGE_USER) as IUser | null,
    users: [] as IUser[]
  }),
  actions: {
    setUser(user: IUser){
      this.user = user;
      storage.saveItem(KEY_STORAGE_USER, user);
    },
    async fetchUsers(): Promise<IUser[]> {
      const response = await fetchApi('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
      }

      const { users } = await response.json();
      this.users = users;
      
      return this.users;
    },
    resetStore(){
      // reset user
      this.user = null;
      storage.removeItem(KEY_STORAGE_USER);

      this.$reset();
    }
  }
})