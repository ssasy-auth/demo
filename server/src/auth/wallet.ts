import { Wallet, KeyModule } from "@ssasy-auth/core";
import type { PrivateKey, RawKey } from "@ssasy-auth/core";

/**
 * !IMPORTANT!
 * 
 * This is only for demonstration purposes. In a production environment,
 * the private key should be stored and retrieved from a secure location
 * (e.g. environment variables, cloud storage) just like you would do with
 * a server secret or database password.
 * 
 * To generate a private key, see -> https://github.com/ssasy-auth/core#generate-cryptographic-keys
 */
const SERVER_PRIVATE_KEY = {
	type: "private-key" as any,
	crypto: {
		crv: "P-256",
		d: "Lx_mMx_xH0CLwaTBzLsd-mkJFTw1KxyYF7EekCT_Ha0", // <-- This is the private key
		ext: true,
		key_ops: ["deriveKey"],
		kty: "EC",
		x: "Mls1CN76cdFmNsUoIr6iTlwIYq8GchZb7NfriViHm8Y",
		y: "eIyB-0BoKVqW8IBsA6MO2VgwtevFXSXItO1buemiYwU",
	},
} as RawKey;

export async function getServerWallet(): Promise<Wallet> {
  const privateKey = await KeyModule.importKey(SERVER_PRIVATE_KEY) as PrivateKey;
  return new Wallet(privateKey);
}