import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { CreditWalletBalance } from "./creditWalletBalance";
import { DebitWalletBalance } from "./debitWalletBalance";
import { WalletId } from "./walletId";
import { WalletTransactionAmount } from "./walletTransactionAmount";
import { WalletTransactionId } from "./walletTransactionId";
import { WalletTransactionNarration } from "./walletTransactionNarration";
import { WalletTransactionReference } from "./walletTransactionReference";
import { WalletTransactionStatus } from "./walletTransactionStatus";
import { WalletTransactionType } from "./walletTransactionType";

interface WalletTransactionProps {
  amount: WalletTransactionAmount;
  debitWalletId: WalletId;
  creditWalletId: WalletId;
  transactionType: WalletTransactionType;
  status: WalletTransactionStatus;
  ref: WalletTransactionReference;
  prevCreditWalletBalance: CreditWalletBalance;
  prevDebitWalletBalance: DebitWalletBalance;
  newCreditWalletBalance: CreditWalletBalance;
  newDebitWalletBalance: DebitWalletBalance;
  narration: WalletTransactionNarration;
}

export class WalletTransaction extends Entity<WalletTransactionProps> {
  get walletTransactionId(): WalletTransactionId {
    return WalletTransactionId.create(this._id).getValue();
  }
  get amount(): WalletTransactionAmount {
    return this.props.amount;
  }

  get debitWalletId(): WalletId {
    return this.props.debitWalletId;
  }

  get creditWalletId(): WalletId {
    return this.props.creditWalletId;
  }

  get narration(): WalletTransactionNarration {
    return this.props.narration;
  }

  get status(): WalletTransactionStatus {
    return this.props.status;
  }

  get transactionType(): WalletTransactionType {
    return this.props.transactionType;
  }

  get prevDebitWalletBalance(): DebitWalletBalance {
    return this.props.prevDebitWalletBalance;
  }

  get prevCreditWalletBalance(): CreditWalletBalance {
    return this.props.prevCreditWalletBalance;
  }

  get ref(): WalletTransactionReference {
    return this.props.ref;
  }

  get newDebitWalletBalance(): DebitWalletBalance {
    return this.props.newDebitWalletBalance;
  }

  get newCreditWalletBalance(): CreditWalletBalance {
    return this.props.newCreditWalletBalance;
  }

  private constructor(props: WalletTransactionProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: WalletTransactionProps,
    id?: UniqueEntityID
  ): Result<WalletTransaction> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.amount, argumentName: "amount" },
      { argument: props.debitWalletId, argumentName: "debitWalletId" },
      { argument: props.creditWalletId, argumentName: "creditWalletId" },
      { argument: props.transactionType, argumentName: "transactionType" },
      { argument: props.status, argumentName: "status" },
      { argument: props.narration, argumentName: "narration" },
      {
        argument: props.prevCreditWalletBalance,
        argumentName: "prevCreditWalletBalance"
      },
      {
        argument: props.prevDebitWalletBalance,
        argumentName: "prevDebitWalletBalance"
      },
      {
        argument: props.newCreditWalletBalance,
        argumentName: "newCreditWalletBalance"
      },
      {
        argument: props.newDebitWalletBalance,
        argumentName: "newDebitWalletBalance"
      }
    ]);
    if (guardResult.isFailure) {
      return Result.fail<WalletTransaction>(guardResult.getErrorValue());
    }

    const profile = new WalletTransaction(
      {
        ...props
      },
      id
    );

    return Result.ok<WalletTransaction>(profile);
  }
}
