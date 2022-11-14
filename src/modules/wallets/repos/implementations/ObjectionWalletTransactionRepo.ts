import { WalletTransactionModel } from "../../../../shared/infra/database/knex/models/WalletTransactionModel";
import { WalletTransaction } from "../../domain/walletTransaction";
import { WalletTransactionMap } from "../../mappers/walletTransactionMap";
import { IWalletTransactionRepo } from "../walletTransactionRepo";

export class ObjectionWalletTransactionRepo implements IWalletTransactionRepo {
  constructor(private walletTransactionModel: typeof WalletTransactionModel) {
    this.walletTransactionModel = walletTransactionModel;
  }
  /* eslint-disable */
  async getWalletTransactionById(
    walletTransactionId: string
  ): Promise<WalletTransaction> {
    return;
  }
  async saveWalletToWalletTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void> {}

  async saveWalletFundWithdrawalTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void> {}

  /* eslint-enable */
  async saveWalletFundingTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void> {
    const objectionWalletTransaction = await WalletTransactionMap.toPersistence(
      walletTransaction
    );
    await this.walletTransactionModel.query().insert({
      ...objectionWalletTransaction
    });
  }
}
