import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface CreditWalletBalanceProps {
  amount: number;
}

export class CreditWalletBalance extends ValueObject<CreditWalletBalanceProps> {
  get value(): number {
    return this.props.amount;
  }

  private constructor(props: CreditWalletBalanceProps) {
    super(props);
  }

  public static create(
    props: CreditWalletBalanceProps
  ): Result<CreditWalletBalance> {
    const debitWalletBalanceNullOrUndefinedResult =
      Guard.againstNullOrUndefined(props.amount, "CreditWalletBalance");
    if (debitWalletBalanceNullOrUndefinedResult.isFailure) {
      return Result.fail<CreditWalletBalance>(
        debitWalletBalanceNullOrUndefinedResult.getErrorValue()
      );
    }
    const creditWalletBalanceInRangeResult = Guard.isLower(
      props.amount,
      0,
      "creditWalletBalance"
    );

    if (creditWalletBalanceInRangeResult.isFailure) {
      return Result.fail<CreditWalletBalance>(
        creditWalletBalanceInRangeResult.getErrorValue()
      );
    }

    return Result.ok<CreditWalletBalance>(new CreditWalletBalance(props));
  }
}
