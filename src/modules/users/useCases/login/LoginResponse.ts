import { Either, Result } from "../../../../shared/core/Result";
import { LoginDTOResponse } from "./LoginDTO";
import * as LoginUseCaseErrors from "./LoginErrors";
import * as AppError from "../../../../shared/core/AppError";

export type LoginResponse = Either<
  | LoginUseCaseErrors.PasswordDoesntMatchError
  | LoginUseCaseErrors.EmailDoesntExistError
  | AppError.UnexpectedError
  | Result<any>,
  Result<LoginDTOResponse>
>;
