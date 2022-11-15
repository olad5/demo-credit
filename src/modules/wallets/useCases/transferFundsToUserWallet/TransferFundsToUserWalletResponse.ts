import { Either, Result } from "../../../../shared/core/Result";
import * as TransferFundsToUserWalletErrors from "./TransferFundsToUserWalletErrors";
import * as AppError from "../../../../shared/core/AppError";

export type WalletFundingResponse = {
  paymentAuthorizationUrl: string;
  ref: string;
};

export type TransferFundsToUserWalletResponse = Either<
  | TransferFundsToUserWalletErrors.InsufficientFundsError
  | TransferFundsToUserWalletErrors.UserWalletNotFoundError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
