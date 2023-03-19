import type { RawKey } from '@this-oliver/ssasy';

export enum MessageType {
  REQUEST_PUBLIC_KEY = 'request-public-key',
  REQUEST_SOLUTION = 'request-solution',
  REQUEST_PING = 'request-ping',
  RESPONSE_PUBLIC_KEY = 'response-public-key',
  RESPONSE_SOLUTION = 'response-solution',
  RESPONSE_PING = 'response-ping',
  RESPONSE_ERROR = 'response-error',
}

export type RequestMode = 'registration' | 'login';

export interface BaseMessage {
  type: MessageType;
  description?: string;
}

export interface BaseRequest extends BaseMessage {
  origin: string;
}

export interface PublicKeyRequest extends BaseRequest {
  type: MessageType.REQUEST_PUBLIC_KEY;
  mode: RequestMode;
}

export interface PublicKeyResponse extends BaseMessage {
  type: MessageType.RESPONSE_PUBLIC_KEY;
  key: string | null;
}

export interface ChallengeRequest extends BaseRequest {
  type: MessageType.REQUEST_SOLUTION;
  mode: RequestMode;
  challenge: string;
}

export interface ChallengeResponse extends BaseMessage {
  type: MessageType.RESPONSE_SOLUTION;
  solution: string | null;
}

export interface ErrorResponse extends BaseMessage {
  type: MessageType.RESPONSE_ERROR;
  error: string;
}

/**
 * Returns true if the browser has the Ssasy extension installed.
 */
async function extensionInstalled(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      // listen for response from extension
      window.addEventListener('message', (event) => {
        const message: BaseMessage = { 
          type: event.data.type, 
          description: event.data.description
        };

        if (message.type === MessageType.RESPONSE_PING) {
          console.log('[ssasy-index] Received ping from extension');
          // extension is installed
          resolve(true);
        }

        if(message.type === MessageType.RESPONSE_ERROR){
          const errorResponse: ErrorResponse = {
            type: event.data.type,
            error: event.data.error
          };

          reject(errorResponse.error);
        }
      });
    
      // send message to extension
      const request: BaseRequest = { origin: '*', type: MessageType.RESPONSE_PING };
      window.postMessage(request, '*');
      
    } catch (error) {
      console.warn(`[ssasy-index] error: ${error}`);
      resolve(false);
    }
  });
}

/**
 * Returns the public key of the user from the Ssasy extension.
 */
async function getUserPublicKey(mode: RequestMode): Promise<RawKey | null> {
  return new Promise((resolve, reject) => {
    try {
      // listen for response from extension
      window.addEventListener('message', (event) => {
        const message: BaseMessage = { 
          type: event.data.type
        };
  
        if (message.type === MessageType.RESPONSE_PUBLIC_KEY) {
          console.log('[ssasy-index] Received public key from extension');

          const keyResponse: PublicKeyResponse = {
            type: event.data.type,
            key: event.data.key
          };

          return keyResponse.key 
            ? resolve(JSON.parse(keyResponse.key) as RawKey)
            : resolve(null);
        }

        if(message.type === MessageType.RESPONSE_ERROR){
          const errorResponse: ErrorResponse = {
            type: event.data.type,
            error: event.data.error
          };

          reject(errorResponse.error);
        }
      });
  
      // send message to extension
      const request: PublicKeyRequest = { origin: '*', mode: mode, type: MessageType.REQUEST_PUBLIC_KEY };
      window.postMessage(request, '*');
      
    } catch (error) {
      console.warn(`[ssasy-index] error: ${error}`);
      resolve(null);
    }
  });
}

/**
 * Returns the solution to the challenge from the Ssasy extension.
 */
async function getSolution(mode: RequestMode, encryptedChallenge: string): Promise<string | null> {

  return new Promise((resolve, reject) => {
    // listen for response from extension
    window.addEventListener('message', (event) => {
      const message: BaseMessage = { type: event.data.type };

      if(message.type === MessageType.RESPONSE_SOLUTION){
        console.log('[ssasy-index] Received solution from extension');

        const response: ChallengeResponse = {
          type: event.data.type,
          solution: event.data.solution
        };

        if(response.solution){
          resolve(response.solution);

        } else {
          resolve(null);
        }
      }

      if(message.type === MessageType.RESPONSE_ERROR){
        const errorResponse: ErrorResponse = {
          type: event.data.type,
          error: event.data.error
        };

        reject(errorResponse.error);
      }
    });
    
    // send message to extension
    const request: ChallengeRequest = { 
      origin: '', 
      mode: mode,
      type: MessageType.REQUEST_SOLUTION, 
      challenge: encryptedChallenge
    };

    window.postMessage(request, '*');
  });
  
}

export const ExtensionMessenger = {
  extensionInstalled,
  getUserPublicKey,
  getSolution
}