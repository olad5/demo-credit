import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export class UserWalletAlreadyExistsError extends Result<UseCaseError> {
  constructor(userId: string) {
    super(false, {
      message: `The user with userId ${userId} already has a wallet`
    } as UseCaseError);
  }
}
