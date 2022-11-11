import { BaseModel } from "..";

export class WalletModel extends BaseModel {
  id: string;
  user_id: string;
  balance: number;

  static get tableName(): string {
    return "wallet";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type WalletModelType = typeof WalletModel;
