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

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const queryResult = await this.walletModel.query().where("user_id", userId);
    if (queryResult.length === 0) {
      return undefined;
    }
    const knexWallet = queryResult[0];

    return WalletMap.toDomain(knexWallet);
  }

  async update(wallet: Wallet): Promise<void> {
    const knexWallet = await WalletMap.toPersistence(wallet);
    await this.walletModel.query().update({
      ...knexWallet
    });
  }

  async save(wallet: Wallet): Promise<void> {
    const doesWalletExists = await this.exists(wallet);
    if (!doesWalletExists) {
      const knexWallet = await WalletMap.toPersistence(wallet);
      await this.walletModel.query().insert({
        ...knexWallet
      });
    } else {
      await this.update(wallet);
    }
  }
}
