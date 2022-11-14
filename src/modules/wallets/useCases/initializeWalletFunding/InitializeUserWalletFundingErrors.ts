import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export class UserWalletDoesNotExistsError extends Result<UseCaseError> {
  constructor(userId: string) {
    super(false, {
      message: `The user with userId ${userId} does not have a wallet`
    } as UseCaseError);
  }
}

export class PaymentServiceInitializationError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `Payment Service Initialization failed`
    } as UseCaseError);
  }
}
