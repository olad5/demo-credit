export interface TransferFundsToUserWalletDTO {
  recipientUserId: string;
  senderUserId: string;
  amount: number;
  narration: string;
}
