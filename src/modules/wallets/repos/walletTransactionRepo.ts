import { WalletTransaction } from "../domain/walletTransaction";

export interface IWalletTransactionRepo {
  getWalletTransactionById(
    walletTransactionId: string
  ): Promise<WalletTransaction>;
  saveWalletToWalletTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void>;
  saveWalletFundingTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void>;
  saveWalletFundWithdrawalTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void>;
}
