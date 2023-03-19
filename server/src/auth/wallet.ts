import { getKey } from "../util";
import { Wallet, KeyModule } from "@this-oliver/ssasy";
import type { PrivateKey } from "@this-oliver/ssasy";

export async function getServerWallet(): Promise<Wallet> {
  const privateKey = await KeyModule.importKey(getKey()) as PrivateKey;
  return new Wallet(privateKey);
}