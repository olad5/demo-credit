import { DBTransaction } from "../../../shared/infra/database/knex";
import { Wallet } from "../domain/wallet";

export interface IWalletRepo {
  exists(wallet: Wallet): Promise<boolean>;
  saveBulk(
    creditWallet: Wallet,
    debitWallet: Wallet,
    trx: DBTransaction
  ): Promise<void>;
  getWalletByUserId(userId: string): Promise<Wallet>;
  getWalletByWalletId(walletId: string): Promise<Wallet>;
  save(wallet: Wallet, trx?: DBTransaction): Promise<void>;
}
