import { Result } from "../../../../shared/core/Result";
import { UseCaseError } from "../../../../shared/core/UseCaseError";

export class WalletTransactionNotFoundError extends Result<UseCaseError> {
  constructor(walletTransactionId: string) {
    super(false, {
      message: `The walletTransaction with walletTransactionId ${walletTransactionId} does not exist`
    } as UseCaseError);
  }
}
