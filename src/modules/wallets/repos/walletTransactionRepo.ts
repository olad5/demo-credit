import { Wallet } from "../domain/wallet";
import { WalletTransaction } from "../domain/walletTransaction";

export interface IWalletTransactionRepo {
  getWalletTransactionById(
    walletTransactionId: string
  ): Promise<WalletTransaction>;
  saveWalletToWalletTransaction(
    debitWallet: Wallet,
    creditWallet: Wallet,
    walletTransaction: WalletTransaction
  ): Promise<void>;
  getPendingWalletFundingTransactions(): Promise<WalletTransaction[]>;
  saveWalletFundingTransaction(
    walletTransaction: WalletTransaction,
    creditWallet?: Wallet
  ): Promise<void>;
  saveWalletFundWithdrawalTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void>;
}
