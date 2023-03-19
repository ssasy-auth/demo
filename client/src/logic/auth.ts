import { ExtensionMessenger } from '@/logic';
import { useAuthStore } from '@/stores';
import type { RawKey } from '@this-oliver/ssasy';
import type { IUser } from '@/stores';

export async function registerUser(username: string): Promise<IUser>{
  // get public key from extension
  const publicKey: RawKey | null = await ExtensionMessenger.getUserPublicKey('registration');
        
  if(!publicKey){
    throw new Error('did not receive a public key :(');
  }
        
  // get challenge from server
  const authStore = useAuthStore();
  const encryptedChallenge = await authStore.getChallenge(publicKey);
  
  // get solution for challenge from extension
  const encryptedSolution = await ExtensionMessenger.getSolution('registration', encryptedChallenge);
  
  if(!encryptedSolution){
    throw new Error('did not receive a solution :(');
  }
  
  // send solution to server for verification
  return await authStore.registerUser(publicKey, username as string, encryptedSolution);
}

export async function loginUser(): Promise<IUser>{
  // get public key from extension
  const publicKey: RawKey | null = await ExtensionMessenger.getUserPublicKey('login');
      
  if(!publicKey){
    throw new Error('did not receive a public key :(')
  }
      
  // get challenge from server
  const authStore = useAuthStore();
  const encryptedChallenge = await authStore.getChallenge(publicKey);
  
  // get solution for challenge from extension
  const encryptedSolution = await ExtensionMessenger.getSolution('login', encryptedChallenge);
  
  if(!encryptedSolution){
    throw new Error('did not receive a solution :(')
  }
  
  // send solution to server for verification
  return await authStore.loginUser(publicKey, encryptedSolution);
}