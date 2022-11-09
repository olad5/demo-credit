import { Either, Result } from "../../../../shared/core/Result";
import * as CreateUserErrors from "./CreateUserErrors";
import * as UserErrors from "../../errors/index";
import * as AppError from "../../../../shared/core/AppError";

export type CreateUserResponse = Either<
  | CreateUserErrors.EmailAlreadyExistsError
  | UserErrors.NullOrUndefinedFieldsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;
