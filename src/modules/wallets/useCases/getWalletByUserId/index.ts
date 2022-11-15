import { walletRepo } from "../../repos";
import { GetWalletByUserIdController } from "./GetWalletByUserIdController";
import { GetWalletByUserIdUseCase } from "./GetWalletByUserIdUseCase";

const getWalletByUserIdUseCase = new GetWalletByUserIdUseCase(walletRepo);
const getWalletByUserIdController = new GetWalletByUserIdController(
  getWalletByUserIdUseCase
);

export { getWalletByUserIdUseCase, getWalletByUserIdController };
