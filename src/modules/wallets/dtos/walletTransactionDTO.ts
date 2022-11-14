export interface WalletTransactionDTO {
  id: string;
  amount: number;
  ref: string;
  narration: string;
  status: string;
  transactionType: string;
  debitWalletId: string;
  creditWalletId: string;
}
