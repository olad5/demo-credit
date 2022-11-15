import { Result } from "../../../shared/core/Result";
import { ValueObject } from "../../../shared/domain/ValueObject";
import { Guard } from "../../../shared/core/Guard";
import { nanoid } from "nanoid";

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
    if (props.text) {
      const maxLengthResult = Guard.againstAtMost(
        this.maxLength,
        props.text,
        "walletTransactionReference"
      );
      if (props.text && maxLengthResult.isFailure) {
        return Result.fail<WalletTransactionReference>(
          maxLengthResult.getErrorValue()
        );
      }
    }
    const walletTransactionReference = props.text
      ? new WalletTransactionReference(props)
      : new WalletTransactionReference({ text: nanoid(20) });

    return Result.ok<WalletTransactionReference>(walletTransactionReference);
  }
}
