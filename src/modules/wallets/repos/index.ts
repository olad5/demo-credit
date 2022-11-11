import { WalletModel } from "../../../shared/infra/database/knex/models/WalletModel";
import { ObjectionWalletRepo } from "./implementations/ObjectionWalletRepo";

const walletRepo = new ObjectionWalletRepo(WalletModel);

export { walletRepo };
