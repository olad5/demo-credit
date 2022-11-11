import { walletRepo } from "../../repos";
import { CreateUserWalletUseCase } from "./CreateUserWalletUseCase";

const createUserWalletUseCase = new CreateUserWalletUseCase(walletRepo);

export { createUserWalletUseCase };
