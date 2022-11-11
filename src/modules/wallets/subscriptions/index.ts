import { createUserWalletUseCase } from "../useCases/createUserWallet";
import { AfterUserCreated } from "./afterUserCreated";

// Subscriptions
new AfterUserCreated(createUserWalletUseCase);
