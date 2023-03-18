export enum ExtensionMessage {
  RequestPublicKey = 'request-public-key',
  RequestSolution = 'request-solution',
  RequestPing = 'request-ping',
  ResponsePublicKey = 'response-public-key',
  ResponseSolution = 'response-solution',
  ResponsePing = 'response-ping'
}

export type MessageType = typeof ExtensionMessage[keyof typeof ExtensionMessage];

export interface MessageData {
	type: MessageType;
	key?: string | null;
}

/**
 * Message interface for communication within the extension and between
 * the extension and websites
 */
export interface SsasyMessage {
	/**
	 * the origin of the message. This should be the orgin of the website
	 * that started the message.
	 */
	origin: string;
  /**
   * the data of the message
   */
	data: MessageData;
}


/**
 * Returns true if the browser has the Ssasy extension installed.
 */
async function extensionInstalled(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      // listen for response from extension
      window.addEventListener('message', (event) => {
        const message: SsasyMessage = { origin: event.origin, data: event.data };

        console.log('[ssasy-index] Received message', message);

        if (message.data.type === ExtensionMessage.ResponsePing) {
          console.log('[ssasy-index] Received ping from extension');
          // extension is installed
          resolve(true);
        }
      });
    
      // send message to extension
      const requestMessage: SsasyMessage = { 
        origin: window.location.origin,
        data: { type: ExtensionMessage.RequestPing } 
      };
      window.postMessage(requestMessage.data, '*');
      
    } catch (error) {
      console.warn(`[ssasy-index] error: ${error}`);
      resolve(false);
    }
  });
}

/**
 * Returns the public key of the user from the Ssasy extension.
 */
async function getUserPublicKey(): Promise<string> {
  throw new Error('Not implemented');
}

/**
 * Returns the solution to the challenge from the Ssasy extension.
 */
async function getSolution(): Promise<string> {
  throw new Error('Not implemented');
}

export const AuthLogic = {
  extensionInstalled,
  getUserPublicKey,
  getSolution
}