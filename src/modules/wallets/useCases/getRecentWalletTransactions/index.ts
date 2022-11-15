import { walletRepo, walletTransactionRepo } from "../../repos";
import { GetRecentWalletTransactionsController } from "./GetRecentWalletTransactionsController";
import { GetRecentWalletTransactionsUseCase } from "./GetRecentWalletTransactionsUseCase";

const getRecentWalletTransactionsUseCase =
  new GetRecentWalletTransactionsUseCase(walletRepo, walletTransactionRepo);
const getRecentWalletTransactionsController =
  new GetRecentWalletTransactionsController(getRecentWalletTransactionsUseCase);

export {
  getRecentWalletTransactionsController,
  getRecentWalletTransactionsUseCase
};
