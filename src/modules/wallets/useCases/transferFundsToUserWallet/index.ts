import { TransferFundsToUserWalletUseCase } from "./TransferFundsToUserWalletUseCase";
import { TransferFundsToUserWalletController } from "./TransferFundsToUserWalletController";
import { walletRepo, walletTransactionRepo } from "../../repos";

const transferFundsToUserWalletUseCase = new TransferFundsToUserWalletUseCase(
  walletTransactionRepo,
  walletRepo
);
const transferFundsToUserWalletController =
  new TransferFundsToUserWalletController(transferFundsToUserWalletUseCase);

export { transferFundsToUserWalletController };
