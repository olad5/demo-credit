import { CreateUserWalletDTO } from "./CreateUserWalletDTO";
import { CreateUserWalletResponse } from "./CreateUserWalletResponse";
import * as CreateUserWalletErrors from "./CreateUserWalletErrors";
import { Result, left, right } from "../../../../shared/core/Result";
import * as AppError from "../../../../shared/core/AppError";
import { IWalletRepo } from "../../repos/walletRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import debug from "debug";
import { WalletBalance } from "../../domain/walletBalance";
import { Wallet } from "../../domain/wallet";

const log = debug("app:CreateUserWalletUseCase");

export class CreateUserWalletUseCase
  implements UseCase<CreateUserWalletDTO, Promise<CreateUserWalletResponse>>
{
  private walletRepo: IWalletRepo;

  constructor(walletRepo: IWalletRepo) {
    this.walletRepo = walletRepo;
  }

  async execute(
    request: CreateUserWalletDTO
  ): Promise<CreateUserWalletResponse> {
    const userId = request.userId;

    const startingBalance = 0;
    const walletBalanceOrError = WalletBalance.create({
      amount: startingBalance
    });

    const payloadResult = Result.combine([walletBalanceOrError]);

    if (payloadResult.isFailure) {
      return left(
        Result.fail<void>(payloadResult.getErrorValue())
      ) as CreateUserWalletResponse;
    }

    const walletBalance: WalletBalance = walletBalanceOrError.getValue();

    const existingUserWallet = await this.walletRepo.getWalletByUserId(
      userId.id.toString()
    );
    const doesUserHaveAWalletAlready = !!existingUserWallet;
    if (doesUserHaveAWalletAlready) {
      return left(
        new CreateUserWalletErrors.UserWalletAlreadyExistsError(
          userId.id.toString()
        )
      ) as CreateUserWalletResponse;
    }

    try {
      const walletOrError: Result<Wallet> = Wallet.create({
        userId,
        walletBalance
      });

      if (walletOrError.isFailure) {
        return left(
          Result.fail<Wallet>(walletOrError.getErrorValue().toString())
        ) as CreateUserWalletResponse;
      }

      const wallet: Wallet = walletOrError.getValue();

      await this.walletRepo.save(wallet);

      return right(Result.ok<void>());
    } catch (err) {
      log(err);
      return left(
        new AppError.UnexpectedError(err)
      ) as CreateUserWalletResponse;
    }
  }
}
