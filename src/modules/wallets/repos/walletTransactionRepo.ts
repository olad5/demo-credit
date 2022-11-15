import { Wallet } from "../domain/wallet";
import { WalletTransaction } from "../domain/walletTransaction";

export interface IWalletTransactionRepo {
  getWalletTransactionByTransactionId(
    walletTransactionId: string
  ): Promise<WalletTransaction>;
  saveWalletToWalletTransaction(
    debitWallet: Wallet,
    creditWallet: Wallet,
    walletTransaction: WalletTransaction
  ): Promise<void>;
  getPendingWalletFundingTransactions(): Promise<WalletTransaction[]>;
  getRecentsWalletTransactionByWalletId(
    wallet: Wallet
  ): Promise<WalletTransaction[]>;
  saveWalletFundingTransaction(
    walletTransaction: WalletTransaction,
    creditWallet?: Wallet
  ): Promise<void>;
}
