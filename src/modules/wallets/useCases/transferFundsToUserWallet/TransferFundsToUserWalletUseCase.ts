import { TransferFundsToUserWalletDTO } from "./TransferFundsToUserWalletDTO";
import * as TransferFundsToUserWalletErrors from "./TransferFundsToUserWalletErrors";
import { Result, left, right, Either } from "../../../../shared/core/Result";
import * as AppError from "../../../../shared/core/AppError";
import { UseCase } from "../../../../shared/core/UseCase";
import { TransferFundsToUserWalletResponse } from "./TransferFundsToUserWalletResponse";
import debug from "debug";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { Guard } from "../../../../shared/core/Guard";
import { IWalletRepo } from "../../repos/walletRepo";
import { IWalletTransactionRepo } from "../../repos/walletTransactionRepo";
import { WalletTransaction } from "../../domain/walletTransaction";
import { WalletTransactionStatus } from "../../domain/walletTransactionStatus";
import { WalletTransactionType } from "../../domain/walletTransactionType";
import { WalletId } from "../../domain/walletId";
import { Wallet } from "../../domain/wallet";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { WalletTransactionAmount } from "../../domain/walletTransactionAmount";
import { DebitWalletBalance } from "../../domain/debitWalletBalance";
import { CreditWalletBalance } from "../../domain/creditWalletBalance";
import { WalletTransactionNarration } from "../../domain/walletTransactionNarration";
import { WalletTransactionReference } from "../../domain/walletTransactionReference";
import { WalletBalance } from "../../domain/walletBalance";

const log = debug("app:TransferFundsToUserWalletUseCase");

type newTransactionDTO = {
  status: WalletTransactionStatus;
  transactionType: WalletTransactionType;
  amount: number;
  narration: string;
  debitWalletId: string;
  creditWalletId: string;
  prevDebitWalletBalance: number;
  prevCreditWalletBalance: number;
  newCreditWalletBalance: number;
  newDebitWalletBalance: number;
};

export class TransferFundsToUserWalletUseCase
  implements
    UseCase<
      TransferFundsToUserWalletDTO,
      Promise<TransferFundsToUserWalletResponse>
    >
{
  private walletTransactionRepo: IWalletTransactionRepo;
  private walletRepo: IWalletRepo;

  constructor(
    walletTransactionRepo: IWalletTransactionRepo,
    walletRepo: IWalletRepo
  ) {
    this.walletTransactionRepo = walletTransactionRepo;
    this.walletRepo = walletRepo;
  }

  private createNewWalletTransaction(
    request: newTransactionDTO
  ): Either<Result<any>, Result<WalletTransaction>> {
    const walletTransactionStatus: WalletTransactionStatus = "success";
    const walletTransactionDebitWalletIdOrError = WalletId.create(
      new UniqueEntityID(request.debitWalletId)
    );
    const walletTransactionCreditWalletIdOrError = WalletId.create(
      new UniqueEntityID(request.creditWalletId)
    );
    const walletTransactionType: WalletTransactionType =
      request.transactionType;
    const walletTransactionAmountOrError = WalletTransactionAmount.create({
      amount: request.amount
    });
    const prevDebitWalletBalanceOrError = DebitWalletBalance.create({
      amount: request.prevDebitWalletBalance
    });
    const newDebitWalletBalanceOrError = DebitWalletBalance.create({
      amount: request.newDebitWalletBalance
    });
    const prevCreditWalletBalanceOrError = CreditWalletBalance.create({
      amount: request.prevCreditWalletBalance
    });
    const newCreditWalletBalanceOrError = CreditWalletBalance.create({
      amount: request.newCreditWalletBalance
    });
    const walletTransactionNarrationOrError = WalletTransactionNarration.create(
      { text: request.narration }
    );
    const walletTransactionReferenceOrError = WalletTransactionReference.create(
      {
        text: undefined
      }
    );
    const payloadResult = Result.combine([
      walletTransactionAmountOrError,
      walletTransactionDebitWalletIdOrError,
      walletTransactionCreditWalletIdOrError,
      newCreditWalletBalanceOrError,
      prevCreditWalletBalanceOrError,
      prevDebitWalletBalanceOrError,
      newDebitWalletBalanceOrError,
      walletTransactionReferenceOrError,
      walletTransactionNarrationOrError
    ]);
    if (payloadResult.isFailure) {
      return left(Result.fail<void>(payloadResult.getErrorValue()));
    }

    const prevCreditWalletBalance = prevCreditWalletBalanceOrError.getValue();
    const prevDebitWalletBalance = prevDebitWalletBalanceOrError.getValue();
    const newCreditWalletBalance = newCreditWalletBalanceOrError.getValue();
    const newDebitWalletBalance = newDebitWalletBalanceOrError.getValue();
    const walletTransactionNarration =
      walletTransactionNarrationOrError.getValue();
    const walletTransactionDebitWalletId =
      walletTransactionDebitWalletIdOrError.getValue();
    const walletTransactionCreditWalletId =
      walletTransactionCreditWalletIdOrError.getValue();
    const walletTransactionAmount: WalletTransactionAmount =
      walletTransactionAmountOrError.getValue();
    const walletTransactionReference: WalletTransactionReference =
      walletTransactionReferenceOrError.getValue();

    const walletTransactionOrError: Result<WalletTransaction> =
      WalletTransaction.create({
        status: walletTransactionStatus,
        amount: walletTransactionAmount,
        transactionType: walletTransactionType,
        ref: walletTransactionReference,
        debitWalletId: walletTransactionDebitWalletId,
        creditWalletId: walletTransactionCreditWalletId,
        prevDebitWalletBalance,
        prevCreditWalletBalance,
        newDebitWalletBalance,
        newCreditWalletBalance,
        narration: walletTransactionNarration
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

  private updateUserWallets(
    existingDebitWallet: Wallet,
    newDebitWalletBalance: number,
    existingCreditWallet: Wallet,
    newCreditWalletBalance: number
  ): [Wallet, Wallet] {
    const newDebitWallet = Wallet.create(
      {
        userId: existingDebitWallet.userId,
        walletBalance: WalletBalance.create({
          amount: newDebitWalletBalance
        }).getValue()
      },
      existingDebitWallet.walletId.id
    ).getValue();
    const newCreditWallet = Wallet.create(
      {
        userId: existingCreditWallet.userId,
        walletBalance: WalletBalance.create({
          amount: newCreditWalletBalance
        }).getValue()
      },
      existingCreditWallet.walletId.id
    ).getValue();

    return [newDebitWallet, newCreditWallet];
  }

  async execute(
    request: TransferFundsToUserWalletDTO
  ): Promise<TransferFundsToUserWalletResponse> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: request.recipientUserId, argumentName: "recipientUserId" },
      { argument: request.senderUserId, argumentName: "senderUserId" },
      { argument: request.amount, argumentName: "amount" },
      { argument: request.narration, argumentName: "narration" }
    ]);

    if (guardResult.isFailure) {
      return left(
        new AppError.NullOrUndefinedFieldsError(guardResult.getErrorValue())
      );
    }

    const senderUserId: string = request.senderUserId;
    const recipientUserId: string = request.recipientUserId;
    const amountToTransfer = Number(request.amount);
    const transactionNarration: string = TextUtils.sanitize(request.narration);

    try {
      const senderWallet = await this.walletRepo.getWalletByUserId(
        senderUserId
      );
      const recipientWallet = await this.walletRepo.getWalletByUserId(
        recipientUserId
      );
      const doesSenderWalletExists = !!senderWallet;
      const doesReceipentWalletExists = !!recipientWallet;

      if (!doesSenderWalletExists) {
        return left(
          new TransferFundsToUserWalletErrors.UserWalletNotFoundError(
            senderUserId
          )
        ) as TransferFundsToUserWalletResponse;
      }

      if (!doesReceipentWalletExists) {
        return left(
          new TransferFundsToUserWalletErrors.UserWalletNotFoundError(
            recipientUserId
          )
        ) as TransferFundsToUserWalletResponse;
      }

      const isSenderSameAsRecipient = senderWallet.walletId.equals(
        recipientWallet.walletId
      );

      if (isSenderSameAsRecipient) {
        return left(
          new TransferFundsToUserWalletErrors.CannotSendMoneyToSelfError()
        ) as TransferFundsToUserWalletResponse;
      }

      const doesSenderHaveSufficientFundsToPerformTransaction =
        senderWallet.walletBalance.value >= amountToTransfer;

      if (!doesSenderHaveSufficientFundsToPerformTransaction) {
        return left(
          new TransferFundsToUserWalletErrors.InsufficientFundsError(
            senderUserId
          )
        ) as TransferFundsToUserWalletResponse;
      }
      const newDebitWalletBalance: number =
        senderWallet.walletBalance.value - amountToTransfer;
      const newCreditWalletBalance: number =
        recipientWallet.walletBalance.value + amountToTransfer;

      const createNewWalletTransactionResult = this.createNewWalletTransaction({
        status: "success",
        amount: amountToTransfer,
        narration: transactionNarration,
        transactionType: "wallet_to_wallet",
        debitWalletId: senderWallet.walletId.id.toString(),
        creditWalletId: recipientWallet.walletId.id.toString(),
        prevDebitWalletBalance: senderWallet.walletBalance.value,
        prevCreditWalletBalance: recipientWallet.walletBalance.value,
        newDebitWalletBalance,
        newCreditWalletBalance
      });
      if (!createNewWalletTransactionResult.isRight()) {
        return left(
          Result.fail<void>(
            createNewWalletTransactionResult.value.getErrorValue()
          )
        ) as TransferFundsToUserWalletResponse;
      }
      const walletTransaction =
        createNewWalletTransactionResult.value.getValue();

      const updatedUserWallets = this.updateUserWallets(
        senderWallet,
        newDebitWalletBalance,
        recipientWallet,
        newCreditWalletBalance
      );
      await this.walletTransactionRepo.saveWalletToWalletTransaction(
        ...updatedUserWallets,
        walletTransaction
      );

      return right(Result.ok<void>());
    } catch (err) {
      log(err);
      return left(
        new AppError.UnexpectedError(err)
      ) as TransferFundsToUserWalletResponse;
    }
  }
}
