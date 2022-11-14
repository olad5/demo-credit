import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface WalletTransactionAmountProps {
  amount: number;
}

export class WalletTransactionAmount extends ValueObject<WalletTransactionAmountProps> {
  get value(): number {
    return this.props.amount;
  }

  private constructor(props: WalletTransactionAmountProps) {
    super(props);
  }

  public static create(
    props: WalletTransactionAmountProps
  ): Result<WalletTransactionAmount> {
    const walletBalanceNullOrUndefinedResult = Guard.againstNullOrUndefined(
      props.amount,
      "WalletTransactionAmount"
    );
    if (walletBalanceNullOrUndefinedResult.isFailure) {
      return Result.fail<WalletTransactionAmount>(
        walletBalanceNullOrUndefinedResult.getErrorValue()
      );
    }
    const walletBalanceInRangeResult = Guard.isLower(
      props.amount,
      0,
      "WalletTransactionAmount"
    );

    if (walletBalanceInRangeResult.isFailure) {
      return Result.fail<WalletTransactionAmount>(
        walletBalanceInRangeResult.getErrorValue()
      );
    }

    return Result.ok<WalletTransactionAmount>(
      new WalletTransactionAmount(props)
    );
  }
}
