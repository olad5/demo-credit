import * as AppError from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Wallet } from "../../domain/wallet";
import * as GetWalletByUserIdErrors from "./GetWalletByUserIdErrors";

export type GetWalletByUserIdResponse = Either<
  | GetWalletByUserIdErrors.UserWalletNotFoundError
  | AppError.UnexpectedError
  | Result<any>,
  Result<Wallet>
>;
