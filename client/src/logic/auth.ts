import { Bridge } from '@ssasy-auth/extension';
import { useAuthStore } from '@/stores';
import { SerializerModule } from '@ssasy-auth/core';
import type { IUser } from '@/stores';
import type { RawKey } from '@ssasy-auth/core';

const AuthError = {
  PUBLIC_KEY_DENIED: 'did not receive a public key',
  CHALLENGE_RESPONSE_DENIED: 'did not receive a challenge response'
}

/**
 * Converts raw PublicKey to URI
 */
async function convertRawKeyToUri(rawKey: RawKey): Promise<string> {
  return await SerializerModule.serializeKey(rawKey);
}

export async function registerUser(username: string): Promise<IUser>{
  // get public key from extension
  const publicKey: RawKey | null = await Bridge.requestPublicKey('registration') as RawKey;
        
  if(!publicKey){
    throw new Error(AuthError.PUBLIC_KEY_DENIED);
  }

  // convert public key to URI
  const publicKeyUri: string = await convertRawKeyToUri(publicKey);
        
  // get challenge from server
  const authStore = useAuthStore();
  const encryptedChallenge: string = await authStore.getChallenge(publicKeyUri);
  
  // get solution for challenge from extension
  const encryptedSolution: string | null = await Bridge.requestSolution('registration', encryptedChallenge);
  
  if(!encryptedSolution){
    throw new Error(AuthError.CHALLENGE_RESPONSE_DENIED);
  }
  
  // send solution to server for verification
  return await authStore.registerUser(publicKeyUri, username as string, encryptedSolution);
}

export async function loginUser(): Promise<IUser>{
  // get public key from extension
  const publicKey: RawKey | null = await Bridge.requestPublicKey('login') as RawKey;
      
  if(!publicKey){
    throw new Error(AuthError.PUBLIC_KEY_DENIED);
  }

  // convert public key to URI
  const publicKeyUri: string = await convertRawKeyToUri(publicKey);
      
  // get challenge from server
  const authStore = useAuthStore();
  const encryptedChallenge: string = await authStore.getChallenge(publicKeyUri);
  
  // get solution for challenge from extension
  const encryptedChallengeResponse = await Bridge.requestSolution('login', encryptedChallenge);
  
  if(!encryptedChallengeResponse){
    throw new Error(AuthError.CHALLENGE_RESPONSE_DENIED);
  }
  
  // send solution to server for verification
  return await authStore.loginUser(publicKeyUri, encryptedChallengeResponse);
}