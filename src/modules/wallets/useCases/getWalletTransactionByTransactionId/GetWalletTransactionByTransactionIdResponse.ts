import * as AppError from "../../../../shared/core/AppError";
import { Either, Result } from "../../../../shared/core/Result";
import { WalletTransaction } from "../../domain/walletTransaction";
import * as GetWalletTransactionByTransactionIdErrors from "./GetWalletTransactionByTransactionIdErrors";

export type GetWalletTransactionByTransactionIdResponse = Either<
  | GetWalletTransactionByTransactionIdErrors.WalletTransactionNotFoundError
  | AppError.UnexpectedError
  | Result<any>,
  Result<WalletTransaction>
>;
