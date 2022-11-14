import { BaseModel } from "..";

export class WalletTransactionModel extends BaseModel {
  id: string;
  narration: string;
  ref: string;
  amount: number;
  debit_wallet_id: string;
  credit_wallet_id: string;
  transaction_type: "wallet_funding" | "wallet_withdrawal" | "wallet_to_wallet";
  status: "pending" | "success" | "failed";
  prev_debit_wallet_balance: number;
  new_debit_wallet_balance: number;
  prev_credit_wallet_balance: number;
  new_credit_wallet_balance: number;

  static get tableName(): string {
    return "wallet_transaction";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type WalletTransactionModelType = Pick<
  WalletTransactionModel,
  | "id"
  | "amount"
  | "narration"
  | "ref"
  | "status"
  | "transaction_type"
  | "prev_debit_wallet_balance"
  | "prev_credit_wallet_balance"
  | "new_debit_wallet_balance"
  | "new_credit_wallet_balance"
  | "debit_wallet_id"
  | "credit_wallet_id"
>;
