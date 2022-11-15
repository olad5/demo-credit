import { UseCaseError } from "../../../../shared/core/UseCaseError";
import { Result } from "../../../../shared/core/Result";

export class InsufficientFundsError extends Result<UseCaseError> {
  constructor(userId: string) {
    super(false, {
      message: `The user with userId ${userId} does not have enough funds to make this transaction`
    } as UseCaseError);
  }
}

export class UserWalletNotFoundError extends Result<UseCaseError> {
  constructor(userId: string) {
    super(false, {
      message: `The user with userId ${userId} does not have have wallet`
    } as UseCaseError);
  }
}

export class CannotSendMoneyToSelfError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `User cannot send money to self`
    } as UseCaseError);
  }
}
