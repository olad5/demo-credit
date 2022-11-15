import { Either, Result } from "../../../../shared/core/Result";
import * as FundUserWalletErrors from "./FundUserWalletErrors";
import * as AppError from "../../../../shared/core/AppError";

export type FundUserWalletResponse = Either<
  | FundUserWalletErrors.PaymentServiceVerificationError
  | FundUserWalletErrors.PaymentInitailizedFailedError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
