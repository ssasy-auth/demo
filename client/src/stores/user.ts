import { defineStore } from 'pinia'
import { fetchApi } from '@/util';
import type { RawKey, StandardCiphertext } from '@this-oliver/ssasy'

export interface IUser {
  id?: string;
  username: string;
  credential: { publicKey: RawKey, signature: StandardCiphertext };
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [] as IUser[]
  }),
  actions: {
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

      this.users = await response.json();
      
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