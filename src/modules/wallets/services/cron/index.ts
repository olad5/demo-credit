import { walletTransactionRepo } from "../../repos";
import { fundUserWalletUseCase } from "../../useCases/fundUserWallet";
import { VerifyPendingWalletFundingTransactions } from "./verifyPendingFundingTransactions";

const cronTask = new VerifyPendingWalletFundingTransactions(
  walletTransactionRepo,
  fundUserWalletUseCase
);
cronTask.run();
