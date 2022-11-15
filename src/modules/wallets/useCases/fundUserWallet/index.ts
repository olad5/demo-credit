import { walletRepo, walletTransactionRepo } from "../../repos";
import { FundUserWalletUseCase } from "./FundUserWalletUseCase";
import { paymentService } from "../../services";

const fundUserWalletUseCase = new FundUserWalletUseCase(
  walletRepo,
  walletTransactionRepo,
  paymentService
);

export { fundUserWalletUseCase };
