import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface WalletTransactionNarrationProps {
  text: string;
}

export class WalletTransactionNarration extends ValueObject<WalletTransactionNarrationProps> {
  public static maxLength = 150;

  get value(): string {
    return this.props.text;
  }

  private constructor(props: WalletTransactionNarrationProps) {
    super(props);
  }

  public static create(
    props: WalletTransactionNarrationProps
  ): Result<WalletTransactionNarration> {
    const walletTransactionNarrationResult = Guard.againstNullOrUndefined(
      props.text,
      "walletTransactionNarration"
    );
    if (walletTransactionNarrationResult.isFailure) {
      return Result.fail<WalletTransactionNarration>(
        walletTransactionNarrationResult.getErrorValue()
      );
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      props.text,
      "walletTransactionNarration"
    );
    if (maxLengthResult.isFailure) {
      return Result.fail<WalletTransactionNarration>(
        maxLengthResult.getErrorValue()
      );
    }

    return Result.ok<WalletTransactionNarration>(
      new WalletTransactionNarration(props)
    );
  }
}
