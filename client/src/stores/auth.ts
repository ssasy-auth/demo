import { defineStore } from 'pinia'
import { useUserStore } from './user';
import { storage } from '@/logic';
import { fetchApi } from '@/util';
import type { IUser } from './user';
import type { RawKey } from '@this-oliver/ssasy'

const KEY_STORAGE_TOKEN = 'ssasy-demo-token';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: storage.getItem(KEY_STORAGE_TOKEN) as string | null
  }),
  getters: {
    hasToken(): boolean {
      return !!this.token;
    }
  },
  actions: {
    async getChallenge(publicKey: RawKey): Promise<string> {
      if(!publicKey){
        throw new Error('Missing public key');
      }

      // request challenge from server
      const response = await fetchApi('/auth/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicKey: publicKey
        })
      });

      if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
      }

      const { ciphertext } = await response.json();

      return ciphertext;
    },
    async registerUser(publicKey: RawKey, username: string, encryptedSolution: string): Promise<IUser> {
      if(!publicKey){
        throw new Error('Missing public key');
      }

      if(!encryptedSolution){
        throw new Error('Missing solution');
      }

      const response = await fetchApi('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicKey: publicKey,
          username: username,
          challenge: encryptedSolution
        })
      });

      if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
      }

      const { user } = await response.json();

      return user;
    },
    async loginUser(publicKey: RawKey, encryptedSolution: string): Promise<IUser>{
      if(!publicKey){
        throw new Error('Missing public key');
      }

      if(!encryptedSolution){
        throw new Error('Missing solution');
      }

      const response = await fetchApi('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          publicKey: publicKey,
          challenge: encryptedSolution
        })
      });

      if(!response.ok){
        const { message } = await response.json();
        throw new Error(message);
      }

      const { user, token } = await response.json();

      // set token
      this.token = token;
      storage.saveItem(KEY_STORAGE_TOKEN, token);

      // set user
      const userStore = useUserStore();
      userStore.setUser(user);

      return user;
    },
    logout(){
      // reset token
      this.token = null;
      storage.removeItem(KEY_STORAGE_TOKEN);

      // reset user
      const userStore = useUserStore();
      userStore.resetStore();
      
      this.$reset();
    }
  }
})