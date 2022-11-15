import { DBTransaction } from "../../../../shared/infra/database/knex";
import { WalletModelType } from "../../../../shared/infra/database/knex/models/WalletModel";
import { Wallet } from "../../domain/wallet";
import { WalletMap } from "../../mappers/walletMap";
import { IWalletRepo } from "../walletRepo";

export class ObjectionWalletRepo implements IWalletRepo {
  constructor(private walletModel: WalletModelType) {
    this.walletModel = walletModel;
  }

  async exists(wallet: Wallet): Promise<boolean> {
    const queryResult = await this.walletModel
      .query()
      .where("id", wallet.walletId.id.toString());
    if (queryResult.length === 0) {
      return false;
    }
    return true;
  }

  async getWalletByWalletId(walletId: string): Promise<Wallet> {
    const queryResult = await this.walletModel.query().where("id", walletId);
    if (queryResult.length === 0) {
      return undefined;
    }
    const knexWallet = queryResult[0];

    return WalletMap.toDomain(knexWallet);
  }

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const queryResult = await this.walletModel.query().where("user_id", userId);
    if (queryResult.length === 0) {
      return undefined;
    }
    const knexWallet = queryResult[0];

    return WalletMap.toDomain(knexWallet);
  }

  async saveBulk(
    creditWallet: Wallet,
    debitWallet: Wallet,
    trx: DBTransaction
  ): Promise<void> {
    const knexCreditWallet = await WalletMap.toPersistence(creditWallet);
    const knexDebitWallet = await WalletMap.toPersistence(debitWallet);
    for (const wallet of [knexDebitWallet, knexCreditWallet]) {
      await this.walletModel.query(trx).findById(wallet.id).patch({
        balance: wallet.balance
      });
    }
  }

  async save(wallet: Wallet, trx?: DBTransaction): Promise<void> {
    const knexWallet = await WalletMap.toPersistence(wallet);
    const doesWalletExists = await this.exists(wallet);
    if (!doesWalletExists) {
      await this.walletModel.query().insert({
        ...knexWallet
      });
    } else {
      await this.walletModel.query(trx).findById(knexWallet.id).patch({
        balance: knexWallet.balance
      });
    }
  }
}
