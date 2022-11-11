import { Guard } from "../../../shared/core/Guard";
import { Result } from "../../../shared/core/Result";
import { Entity } from "../../../shared/domain/Entity";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { UserId } from "../../users/domain/userId";
import { WalletBalance } from "./walletBalance";
import { WalletId } from "./walletId";

interface WalletProps {
  userId: UserId;
  walletBalance: WalletBalance;
}

export class Wallet extends Entity<WalletProps> {
  get walletId(): WalletId {
    return WalletId.create(this._id).getValue();
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get walletBalance(): WalletBalance {
    return this.props.walletBalance;
  }
  private constructor(props: WalletProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: WalletProps,
    id?: UniqueEntityID
  ): Result<Wallet> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: props.walletBalance, argumentName: "walletBalance" }
    ]);
    if (guardResult.isFailure) {
      return Result.fail<Wallet>(guardResult.getErrorValue());
    }

    const profile = new Wallet(
      {
        ...props
      },
      id
    );

    return Result.ok<Wallet>(profile);
  }
}
