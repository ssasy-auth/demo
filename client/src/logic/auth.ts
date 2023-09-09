import { Bridge } from '@ssasy-auth/extension';
import { useAuthStore } from '@/stores';
import type { IUser } from '@/stores';

const AuthError = {
  PUBLIC_KEY_DENIED: 'did not receive a public key',
  CHALLENGE_RESPONSE_DENIED: 'did not receive a challenge response'
};

export async function registerUser(username: string): Promise<IUser> {
  // get public key from extension
  const publicKey: string | null = await Bridge.requestPublicKey('registration');

  if (!publicKey) {
    throw new Error(AuthError.PUBLIC_KEY_DENIED);
  }

  // get challenge from server
  const authStore = useAuthStore();
  const encryptedChallenge: string = await authStore.getChallenge(publicKey);

  // get solution for challenge from extension
  const encryptedSolution: string | null = await Bridge.requestChallengeResponse('registration', encryptedChallenge);

  if (!encryptedSolution) {
    throw new Error(AuthError.CHALLENGE_RESPONSE_DENIED);
  }

  // send solution to server for verification
  return await authStore.registerUser(publicKey, username as string, encryptedSolution);
}

export async function loginUser(): Promise<IUser> {
  // get public key from extension
  const publicKey: string | null = await Bridge.requestPublicKey('login');

  if (!publicKey) {
    throw new Error(AuthError.PUBLIC_KEY_DENIED);
  }

  // get challenge from server
  const authStore = useAuthStore();
  const encryptedChallenge: string = await authStore.getChallenge(publicKey);

  // get solution for challenge from extension
  const encryptedChallengeResponse = await Bridge.requestChallengeResponse('login', encryptedChallenge);

  // throw error if no solution was provided
  if (!encryptedChallengeResponse) {
    throw new Error(AuthError.CHALLENGE_RESPONSE_DENIED);
  }

  // send solution to server for verification
  return await authStore.loginUser(publicKey, encryptedChallengeResponse);
}