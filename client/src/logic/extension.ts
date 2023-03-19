import { EncoderModule } from '@this-oliver/ssasy';
import type { RawKey, Ciphertext } from '@this-oliver/ssasy';

export enum MessageType {
  RequestPublicKey = 'request-public-key',
  RequestSolution = 'request-solution',
  RequestPing = 'request-ping',
  ResponsePublicKey = 'response-public-key',
  ResponseSolution = 'response-solution',
  ResponsePing = 'response-ping',
  ResponseError = 'response-error'
}

/**
 * the foundation of all messages (both requests and responses)
 */
interface BaseMessage {
  /**
   * the description of the message
   */
  description?: string;
}

export interface GenericMessage extends BaseMessage {
  /**
   * the type of the message (can be any of the MessageType enum values)
   */
  type: typeof MessageType[keyof typeof MessageType];
}

export interface GenericRequest extends GenericMessage {
  /**
	 * the origin of the message. This should be the orgin of the website
	 * that started the message.
	 */
  origin: string;
}

/**
 * request messages for the user's public key
 */
export interface KeyRequest extends GenericRequest {
  type: MessageType.RequestPublicKey;
}

/**
 * response messages for the user's public key request
 */
export interface KeyResponse extends BaseMessage {
  type: MessageType.ResponsePublicKey;
  key: string | null;
}

/**
 * request messages for the user's solution to a challenge/response
 */
export interface ChallengeRequest extends GenericRequest {
  type: MessageType.RequestSolution;
  challenge: string;
}

/**
 * response messages to a challenge/response
 */
export interface ChallengeResponse extends BaseMessage {
  type: MessageType.ResponseSolution;
  solution: string | null;
}

/**
 * Returns true if the browser has the Ssasy extension installed.
 */
async function extensionInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // listen for response from extension
      window.addEventListener('message', (event) => {
        const message: GenericMessage = { 
          type: event.data.type, 
          description: event.data.description
        };

        if (message.type === MessageType.ResponsePing) {
          console.log('[ssasy-index] Received ping from extension');
          // extension is installed
          resolve(true);
        }
      });
    
      // send message to extension
      const request: GenericMessage = { type: MessageType.RequestPing };
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
async function getUserPublicKey(): Promise<RawKey | null> {
  return new Promise((resolve) => {
    try {
      // listen for response from extension
      window.addEventListener('message', (event) => {
        const message: GenericMessage = { 
          type: event.data.type
        };
  
        if (message.type === MessageType.ResponsePublicKey) {
          console.log('[ssasy-index] Received public key from extension');

          const keyResponse: KeyResponse = {
            type: event.data.type,
            key: event.data.key
          };

          return keyResponse.key 
            ? resolve(JSON.parse(keyResponse.key) as RawKey)
            : resolve(null);
        }
      });
  
      // send message to extension
      const request: GenericMessage = { type: MessageType.RequestPublicKey };
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
async function getSolution(challengeCiphertext: Ciphertext): Promise<Ciphertext | null> {

  return new Promise((resolve) => {
    // listen for response from extension
    window.addEventListener('message', (event) => {
      const message: GenericMessage = { type: event.data.type };

      if(message.type === MessageType.ResponseSolution){
        console.log('[ssasy-index] Received solution from extension');

        const response: ChallengeResponse = {
          type: event.data.type,
          solution: event.data.solution
        };

        if(response.solution){
          EncoderModule
            .decodeCiphertext(response.solution)
            .then(decodedCiphertext => {
              resolve(decodedCiphertext);
            });

        } else {
          resolve(null);
        }
      }
    });

    // send message to extension
    EncoderModule
      .encodeCiphertext(challengeCiphertext)
      .then(encodedciphertext => {
        const request: ChallengeRequest = { 
          origin: '', 
          type: MessageType.RequestSolution, 
          challenge: encodedciphertext 
        };

        window.postMessage(request, '*');
      });
  });
  
}

export const ExtensionMessenger = {
  extensionInstalled,
  getUserPublicKey,
  getSolution
}