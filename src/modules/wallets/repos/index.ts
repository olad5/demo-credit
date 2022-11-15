import { WalletModel } from "../../../shared/infra/database/knex/models/WalletModel";
import { WalletTransactionModel } from "../../../shared/infra/database/knex/models/WalletTransactionModel";
import { ObjectionWalletRepo } from "./implementations/ObjectionWalletRepo";
import { ObjectionWalletTransactionRepo } from "./implementations/ObjectionWalletTransactionRepo";

const walletRepo = new ObjectionWalletRepo(WalletModel);
const walletTransactionRepo = new ObjectionWalletTransactionRepo(
  WalletTransactionModel,
  walletRepo
);

export { walletRepo, walletTransactionRepo };
