import { Either, Result } from "../../../../shared/core/Result";
import * as CreateUserWalletErrors from "./CreateUserWalletErrors";
import * as AppError from "../../../../shared/core/AppError";

export type CreateUserWalletResponse = Either<
  | CreateUserWalletErrors.UserWalletAlreadyExistsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
