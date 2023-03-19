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

interface AuthConfig {
  inRegistration: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    rawPrivateKey: key as RawKey | undefined
  }),
  actions: {
    async getChallenge(rawPublicKey: RawKey, config?: AuthConfig): Promise<Ciphertext> {
      if(!KeyChecker.isRawKey(rawPublicKey)){
        throw new Error('Invalid public key');
      }

      if(this.rawPrivateKey === undefined){
        throw new Error('Private key not set');
      }

      // use this to determine if the challenge is for registration or login
      const { inRegistration } = config || { inRegistration: false };

      const claimantPublicKey: PublicKey = await KeyModule.importKey(rawPublicKey) as PublicKey;
      const privateKey: PrivateKey = await KeyModule.importKey(this.rawPrivateKey) as PrivateKey;
      const wallet = new Wallet(privateKey);

      // generate challenge
      return await wallet.generateChallenge(claimantPublicKey);
    },
    async verifyChallenge(solution: Ciphertext, config?: AuthConfig): Promise<boolean> {
      if(this.rawPrivateKey === undefined){
        throw new Error('Private key not set');
      }

      // use this to determine if the challenge is for registration or login
      const { inRegistration } = config || { inRegistration: false };

      const privateKey: PrivateKey = await KeyModule.importKey(this.rawPrivateKey) as PrivateKey;
      const wallet = new Wallet(privateKey);
      const result = await wallet.verifyChallenge(solution);
      return result !== null;
    }
  }
})
