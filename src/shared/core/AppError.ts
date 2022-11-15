import { Result } from "./Result";
import { UseCaseError } from "./UseCaseError";
import debug from "debug";

const log = debug("app:AppError");

export class UnexpectedError extends Result<UseCaseError> {
  public constructor(err: any) {
    super(false, {
      message: `An unexpected error occurred.`,
      error: err
    } as UseCaseError);
    log(`[AppError]: An unexpected error occurred`);
    log(err);
  }

  public static create(err: any): UnexpectedError {
    return new UnexpectedError(err);
  }
}

export class NullOrUndefinedFieldsError extends Result<UseCaseError> {
  constructor(error: string) {
    super(false, {
      message: error
    } as UseCaseError);
  }
}
