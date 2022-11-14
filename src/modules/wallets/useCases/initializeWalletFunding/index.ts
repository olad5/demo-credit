import { walletRepo, walletTransactionRepo } from "../../repos";
import { InitializeUserWalletFundingUseCase } from "./InitializeUserWalletFundingUseCase";
import { InitializeUserWalletFundingController } from "./InitializeUserWalletFundingController";
import { paymentService } from "../../services";

const initializeUserWalletFundingUseCase =
  new InitializeUserWalletFundingUseCase(
    walletTransactionRepo,
    walletRepo,
    paymentService
  );
const initializeUserWalletFundingController =
  new InitializeUserWalletFundingController(initializeUserWalletFundingUseCase);

export {
  initializeUserWalletFundingController,
  initializeUserWalletFundingUseCase
};
