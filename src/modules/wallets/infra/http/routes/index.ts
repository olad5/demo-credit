import express from "express";
import { middleware } from "../../../../../shared/infra/http";
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
export { walletsRouter };
