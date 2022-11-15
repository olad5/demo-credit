import { walletTransactionRepo } from "../../repos";
import { GetWalletTransactionByTransactionIdController } from "./GetWalletTransactionByTransactionIdController";
import { GetWalletTransactionByTransactionIdUseCase } from "./GetWalletTransactionByTransactionIdUseCase";

const getWalletTransactionByTransactionIdUseCase =
  new GetWalletTransactionByTransactionIdUseCase(walletTransactionRepo);
const getWalletTransactionByTransactionIdController =
  new GetWalletTransactionByTransactionIdController(
    getWalletTransactionByTransactionIdUseCase
  );

export {
  getWalletTransactionByTransactionIdUseCase,
  getWalletTransactionByTransactionIdController
};
