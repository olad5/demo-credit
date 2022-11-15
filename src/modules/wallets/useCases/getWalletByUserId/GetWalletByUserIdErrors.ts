import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export class UserWalletNotFoundError extends Result<UseCaseError> {
  constructor(userId: string) {
    super(false, {
      message: `The wallet for user with ${userId} does not exist`
    } as UseCaseError);
  }
}
