import { Either, Result } from "../../../../shared/core/Result";
import * as InitializeUserWalletFundingErrors from "./InitializeUserWalletFundingErrors";
import * as AppError from "../../../../shared/core/AppError";

export type WalletFundingResponse = {
  paymentAuthorizationUrl: string;
  ref: string;
};

export type InitializeUserWalletFundingResponse = Either<
  | InitializeUserWalletFundingErrors.PaymentServiceInitializationError
  | InitializeUserWalletFundingErrors.UserWalletDoesNotExistsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<WalletFundingResponse>
>;
