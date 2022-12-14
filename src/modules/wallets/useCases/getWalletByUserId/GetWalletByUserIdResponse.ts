import * as AppError from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { Wallet } from "../../domain/wallet";
import * as WalletErrors from "../../errors/index";

export type GetWalletByUserIdResponse = Either<
  WalletErrors.UserWalletNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<Wallet>
>;
