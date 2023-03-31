import { defineStore } from 'pinia'
import { useUserStore } from './user';
import { storage } from '@/logic';
import { fetchApi } from '@/util';
import type { IUser } from './user';
import type { RawKey } from '@this-oliver/ssasy'

const KEY_STORAGE_USER = 'ssasy-demo-user';
const KEY_STORAGE_TOKEN = 'ssasy-demo-token';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: storage.getItem(KEY_STORAGE_TOKEN) as string | undefined,
    user: storage.getItem(KEY_STORAGE_USER) as IUser | undefined
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

      return await response.json();
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
      storage.saveItem(KEY_STORAGE_TOKEN, this.token);

      // set user
      this.user = user;
      storage.saveItem(KEY_STORAGE_USER, this.user);

      return user;
    },
    logout(){
      // reset token
      this.token = undefined;
      storage.removeItem(KEY_STORAGE_TOKEN);

      // reset user
      this.user = undefined;
      
      this.$reset();
    }
  }
})