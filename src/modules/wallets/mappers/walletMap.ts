import debug from "debug";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { WalletModel } from "../../../shared/infra/database/knex/models/WalletModel";
import { Mapper } from "../../../shared/infra/Mapper";
import { UserId } from "../../users/domain/userId";
import { Wallet } from "../domain/wallet";
import { WalletBalance } from "../domain/walletBalance";
import { WalletDTO } from "../dtos/walletDTO";

export type WalletType = Pick<WalletModel, "id" | "balance" | "user_id">;

const log = debug("app:WalletMap");

export class WalletMap implements Mapper<Wallet> {
  public static toDTO(wallet: Wallet): WalletDTO {
    return {
      walletId: wallet.walletId.id.toString(),
      balance: wallet.walletBalance.value,
      userId: wallet.userId.id.toString()
    };
  }

  public static toDomain(knexModel: WalletType): Wallet | null {
    const walletOrError = Wallet.create(
      {
        walletBalance: WalletBalance.create({
          amount: knexModel.balance
        }).getValue(),
        userId: UserId.create(new UniqueEntityID(knexModel.user_id)).getValue()
      },
      new UniqueEntityID(knexModel.id)
    );

    walletOrError.isFailure ? log(walletOrError.getErrorValue()) : "";

    return walletOrError.isSuccess ? walletOrError.getValue() : null;
  }

  public static async toPersistence(wallet: Wallet): Promise<WalletType> {
    const baseWallet: WalletType = {
      id: wallet.walletId.id.toString(),
      balance: wallet.walletBalance.value,
      user_id: wallet.userId.id.toString()
    };

    return baseWallet;
  }
}
