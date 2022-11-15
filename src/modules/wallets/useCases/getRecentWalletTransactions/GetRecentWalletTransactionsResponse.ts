import * as AppError from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { WalletTransaction } from "../../domain/walletTransaction";
import * as WalletErrors from "../../errors/index";

export type GetRecentWalletTransactionsResponse = Either<
  WalletErrors.UserWalletNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<WalletTransaction[]>
>;
