import { Wallet } from "../domain/wallet";

export interface IWalletRepo {
  exists(wallet: Wallet): Promise<boolean>;
  update(wallet: Wallet): Promise<void>;
  getWalletByUserId(userId: string): Promise<Wallet>;
  save(wallet: Wallet): Promise<void>;
}
