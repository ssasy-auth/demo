import { defineStore } from 'pinia'
import { 
  KeyModule, 
  KeyChecker, 
  Wallet, 
  type PrivateKey, 
  type PublicKey, 
  type RawKey, 
  type Ciphertext
} from '@this-oliver/ssasy'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    rawPrivateKey: undefined as RawKey | undefined
  }),
  actions: {
    async getChallenge(rawPublicKey: RawKey): Promise<Ciphertext> {
      if(!KeyChecker.isRawKey(rawPublicKey)){
        throw new Error('Invalid public key');
      }

      if(this.rawPrivateKey === undefined){
        throw new Error('Private key not set');
      }

      const claimantPublicKey: PublicKey = await KeyModule.importKey(rawPublicKey) as PublicKey;
      
      const privateKey: PrivateKey = await KeyModule.importKey(this.rawPrivateKey) as PrivateKey;
      const wallet = new Wallet(privateKey);

      // generate challenge
      return await wallet.generateChallenge(claimantPublicKey);
    },
    async verifyChallenge(solution: Ciphertext): Promise<boolean> {
      if(this.rawPrivateKey === undefined){
        throw new Error('Private key not set');
      }

      const privateKey: PrivateKey = await KeyModule.importKey(this.rawPrivateKey) as PrivateKey;
      const wallet = new Wallet(privateKey);
      const result = await wallet.verifyChallenge(solution);
      return result !== null;
    },
    login(){
      // get public key and send it to server

      // send challenge to user

      // get solution and send it to server

      // set token for user
    }
  }
})
