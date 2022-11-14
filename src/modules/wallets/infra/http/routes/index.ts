import express from "express";
import { middleware } from "../../../../../shared/infra/http";
import { initializeUserWalletFundingController } from "../../../useCases/initializeWalletFunding";
const walletsRouter = express.Router();

walletsRouter.post(
  "/fund/initialize",
  middleware.ensureAuthenticated(),
  (req, res) => initializeUserWalletFundingController.execute(req, res)
);
export { walletsRouter };
