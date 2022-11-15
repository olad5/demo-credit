import { FundUserWalletDTO } from "./FundUserWalletDTO";
import { FundUserWalletResponse } from "./FundUserWalletResponse";
import * as FundUserWalletErrors from "./FundUserWalletErrors";
import { Result, left, right, Either } from "../../../../shared/core/Result";
import * as AppError from "../../../../shared/core/AppError";
import { IWalletRepo } from "../../repos/walletRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import debug from "debug";
import { WalletBalance } from "../../domain/walletBalance";
import { Wallet } from "../../domain/wallet";
import { IPaymentService } from "../../services/paymentService";
import { WalletTransaction } from "../../domain/walletTransaction";
import { IWalletTransactionRepo } from "../../repos/walletTransactionRepo";

const log = debug("app:FundUserWalletUseCase");

export class FundUserWalletUseCase
  implements UseCase<FundUserWalletDTO, Promise<FundUserWalletResponse>>
{
  private walletRepo: IWalletRepo;
  private walletTransactionRepo: IWalletTransactionRepo;
  private paymentService: IPaymentService;

  constructor(
    walletRepo: IWalletRepo,
    walletTransactionRepo: IWalletTransactionRepo,
    paymentService: IPaymentService
  ) {
    this.walletRepo = walletRepo;
    this.walletTransactionRepo = walletTransactionRepo;
    this.paymentService = paymentService;
  }
  private createNewWalletTransaction(
    pendingWalletTransaction: WalletTransaction
  ): Either<Result<any>, Result<WalletTransaction>> {
    const walletTransactionOrError: Result<WalletTransaction> =
      WalletTransaction.create({
        status: "success",
        amount: pendingWalletTransaction.amount,
        transactionType: pendingWalletTransaction.transactionType,
        ref: pendingWalletTransaction.ref,
        debitWalletId: pendingWalletTransaction.debitWalletId,
        creditWalletId: pendingWalletTransaction.creditWalletId,
        prevDebitWalletBalance: pendingWalletTransaction.prevDebitWalletBalance,
        prevCreditWalletBalance:
          pendingWalletTransaction.prevDebitWalletBalance,
        newDebitWalletBalance: pendingWalletTransaction.newDebitWalletBalance,
        newCreditWalletBalance: pendingWalletTransaction.newCreditWalletBalance,
        narration: pendingWalletTransaction.narration
      });

    if (walletTransactionOrError.isFailure) {
      return left(
        Result.fail<WalletTransaction>(
          walletTransactionOrError.getErrorValue().toString()
        )
      );
    }

    const walletTransaction: WalletTransaction =
      walletTransactionOrError.getValue();

    return right(Result.ok<WalletTransaction>(walletTransaction));
  }

  private updateUserWallet(
    existingCreditWallet: Wallet,
    newCreditWalletBalance: number
  ): Wallet {
    const newCreditWallet = Wallet.create(
      {
        userId: existingCreditWallet.userId,
        walletBalance: WalletBalance.create({
          amount: newCreditWalletBalance
        }).getValue()
      },
      existingCreditWallet.walletId.id
    ).getValue();

    return newCreditWallet;
  }

  async execute(request: FundUserWalletDTO): Promise<FundUserWalletResponse> {
    const pendingWalletTransaction = request.pendingWalletTransaction;

    try {
      const paymentServiceResponse = await this.paymentService.verifyPayment(
        pendingWalletTransaction.ref.value
      );

      if (!paymentServiceResponse.status) {
        return left(
          new FundUserWalletErrors.PaymentServiceVerificationError()
        ) as FundUserWalletResponse;
      }

      if (paymentServiceResponse.data.status !== "success") {
        return left(
          new FundUserWalletErrors.PaymentInitailizedFailedError(
            paymentServiceResponse.data.status
          )
        ) as FundUserWalletResponse;
      }

      const recipientWallet = await this.walletRepo.getWalletByWalletId(
        pendingWalletTransaction.creditWalletId.id.toString()
      );
      const createNewWalletTransactionResult = this.createNewWalletTransaction(
        pendingWalletTransaction
      );
      if (!createNewWalletTransactionResult.isRight()) {
        return left(
          Result.fail<void>(
            createNewWalletTransactionResult.value.getErrorValue()
          )
        ) as FundUserWalletResponse;
      }
      const walletTransaction =
        createNewWalletTransactionResult.value.getValue();

      const updatedUserWallet = this.updateUserWallet(
        recipientWallet,
        pendingWalletTransaction.newCreditWalletBalance.value
      );

      await this.walletTransactionRepo.saveWalletFundingTransaction(
        walletTransaction,
        updatedUserWallet
      );

      return right(Result.ok<void>());
    } catch (err) {
      log(err);
      return left(new AppError.UnexpectedError(err)) as FundUserWalletResponse;
    }
  }
}
