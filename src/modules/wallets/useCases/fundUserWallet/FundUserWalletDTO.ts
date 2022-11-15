import { WalletTransaction } from "../../domain/walletTransaction";

export interface FundUserWalletDTO {
  pendingWalletTransaction: WalletTransaction;
}
