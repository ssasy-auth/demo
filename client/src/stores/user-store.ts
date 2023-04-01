import { defineStore } from 'pinia'
import { fetchApi } from '@/util';
import type { RawKey, StandardCiphertext } from '@ssasy-auth/core'

export interface IUser {
  _id?: string;
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
    async fetchSingleUser(id: string): Promise<IUser> {
      const response = await fetchApi(`/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
      }

      return await response.json();
    }
  }
})