import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export class PaymentServiceVerificationError extends Result<UseCaseError> {
  constructor() {
    super(false, {
      message: `Payment Service verification failed`
    } as UseCaseError);
  }
}

export class PaymentInitailizedFailedError extends Result<UseCaseError> {
  constructor(status: "abandoned" | "failed") {
    super(false, {
      message: `Transaction ${status}`
    } as UseCaseError);
  }
}
