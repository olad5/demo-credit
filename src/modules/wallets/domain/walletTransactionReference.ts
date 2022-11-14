import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";

interface WalletTransactionReferenceProps {
  text: string;
}

export class WalletTransactionReference extends ValueObject<WalletTransactionReferenceProps> {
  public static maxLength = 20;

  get value(): string {
    return this.props.text;
  }
  private constructor(props: WalletTransactionReferenceProps) {
    super(props);
  }

  public static create(
    props: WalletTransactionReferenceProps
  ): Result<WalletTransactionReference> {
    const walletTransactionReferenceResult = Guard.againstNullOrUndefined(
      props.text,
      "walletTransactionReference"
    );
    if (walletTransactionReferenceResult.isFailure) {
      return Result.fail<WalletTransactionReference>(
        walletTransactionReferenceResult.getErrorValue()
      );
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      props.text,
      "walletTransactionReference"
    );
    if (maxLengthResult.isFailure) {
      return Result.fail<WalletTransactionReference>(
        maxLengthResult.getErrorValue()
      );
    }

    return Result.ok<WalletTransactionReference>(
      new WalletTransactionReference(props)
    );
  }
}
