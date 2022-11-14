import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface DebitWalletBalanceProps {
  amount: number;
}

export class DebitWalletBalance extends ValueObject<DebitWalletBalanceProps> {
  get value(): number {
    return this.props.amount;
  }

  private constructor(props: DebitWalletBalanceProps) {
    super(props);
  }

  public static create(
    props: DebitWalletBalanceProps
  ): Result<DebitWalletBalance> {
    const debitWalletBalanceNullOrUndefinedResult =
      Guard.againstNullOrUndefined(props.amount, "DebitWalletBalance");
    if (debitWalletBalanceNullOrUndefinedResult.isFailure) {
      return Result.fail<DebitWalletBalance>(
        debitWalletBalanceNullOrUndefinedResult.getErrorValue()
      );
    }

    return Result.ok<DebitWalletBalance>(new DebitWalletBalance(props));
  }
}
