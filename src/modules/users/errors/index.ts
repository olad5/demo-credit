import { Result } from "../../../shared/core/Result";
import { UseCaseError } from "../../../shared/core/UseCaseError";

export class NullOrUndefinedFieldsError extends Result<UseCaseError> {
  constructor(error: string) {
    super(false, {
      message: error
    } as UseCaseError);
  }
}
