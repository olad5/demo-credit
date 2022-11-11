import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";
import debug from "debug";

const log = debug("app:WalletBalance value object");

interface WalletBalanceProps {
  amount: number;
}

export class WalletBalance extends ValueObject<WalletBalanceProps> {
  get value(): number {
    return this.props.amount;
  }

  private constructor(props: WalletBalanceProps) {
    super(props);
  }

  public static create(props: WalletBalanceProps): Result<WalletBalance> {
    const walletBalanceNullOrUndefinedResult = Guard.againstNullOrUndefined(
      props.amount,
      "WalletBalance"
    );
    if (walletBalanceNullOrUndefinedResult.isFailure) {
      return Result.fail<WalletBalance>(
        walletBalanceNullOrUndefinedResult.getErrorValue()
      );
    }
    const walletBalanceInRangeResult = Guard.isLower(
      props.amount,
      0,
      "walletBalance"
    );

    if (walletBalanceInRangeResult.isFailure) {
      return Result.fail<WalletBalance>(
        walletBalanceInRangeResult.getErrorValue()
      );
    }

    return Result.ok<WalletBalance>(new WalletBalance(props));
  }
}
