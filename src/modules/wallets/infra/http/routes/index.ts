import express from "express";
import { middleware } from "../../../../../shared/infra/http";
import { getRecentWalletTransactionsController } from "../../../useCases/getRecentWalletTransactions";
import { getWalletByUserIdController } from "../../../useCases/getWalletByUserId";
import { getWalletTransactionByTransactionIdController } from "../../../useCases/getWalletTransactionByTransactionId";
import { initializeUserWalletFundingController } from "../../../useCases/initializeWalletFunding";
import { transferFundsToUserWalletController } from "../../../useCases/transferFundsToUserWallet";

const walletsRouter = express.Router();

walletsRouter.post(
  "/fund/initialize",
  middleware.ensureAuthenticated(),
  (req, res) => initializeUserWalletFundingController.execute(req, res)
);
walletsRouter.post(
  "/transaction/transfer",
  middleware.ensureAuthenticated(),
  (req, res) => transferFundsToUserWalletController.execute(req, res)
);

walletsRouter.get(
  "/transaction/:transactionId",
  middleware.ensureAuthenticated(),
  (req, res) => getWalletTransactionByTransactionIdController.execute(req, res)
);

walletsRouter.get("/", middleware.ensureAuthenticated(), (req, res) =>
  getWalletByUserIdController.execute(req, res)
);

walletsRouter.get(
  "/transactions",
  middleware.ensureAuthenticated(),
  (req, res) => getRecentWalletTransactionsController.execute(req, res)
);
export { walletsRouter };
