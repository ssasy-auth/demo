import { getKey } from "../util";
import { Wallet, KeyModule } from "@ssasy-auth/core";
import type { PrivateKey } from "@ssasy-auth/core";

export async function getServerWallet(): Promise<Wallet> {
  const privateKey = await KeyModule.importKey(getKey()) as PrivateKey;
  return new Wallet(privateKey);
}