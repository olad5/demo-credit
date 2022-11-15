import { InitializeUserWalletFundingDTO } from "./InitializeUserWalletFundingDTO";
import {
  InitializeUserWalletFundingResponse,
  WalletFundingResponse
} from "./InitializeUserWalletFundingResponse";
import * as InitializeUserWalletFundingErrors from "./InitializeUserWalletFundingErrors";
import { Result, left, right } from "../../../../shared/core/Result";
import * as AppError from "../../../../shared/core/AppError";
import { IWalletRepo } from "../../repos/walletRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import debug from "debug";
import { IWalletTransactionRepo } from "../../repos/walletTransactionRepo";
import { IPaymentService } from "../../services/paymentService";
import { WalletTransaction } from "../../domain/walletTransaction";
import { WalletTransactionStatus } from "../../domain/walletTransactionStatus";
import { WalletTransactionAmount } from "../../domain/walletTransactionAmount";
import { WalletTransactionType } from "../../domain/walletTransactionType";
import { WalletId } from "../../domain/walletId";
import { UniqueEntityID } from "../../../../shared/domain/UniqueEntityID";
import { DebitWalletBalance } from "../../domain/debitWalletBalance";
import { CreditWalletBalance } from "../../domain/creditWalletBalance";
import { WalletTransactionNarration } from "../../domain/walletTransactionNarration";
import { WalletTransactionReference } from "../../domain/walletTransactionReference";

const log = debug("app:InitializeUserWalletFundingUseCase");

export class InitializeUserWalletFundingUseCase
  implements
    UseCase<
      InitializeUserWalletFundingDTO,
      Promise<InitializeUserWalletFundingResponse>
    >
{
  private walletTransactionRepo: IWalletTransactionRepo;
  private walletRepo: IWalletRepo;
  private paymentService: IPaymentService;

  constructor(
    walletTransactionRepo: IWalletTransactionRepo,
    walletRepo: IWalletRepo,
    paymentService: IPaymentService
  ) {
    this.walletTransactionRepo = walletTransactionRepo;
    this.walletRepo = walletRepo;
    this.paymentService = paymentService;
  }

  async execute(
    request: InitializeUserWalletFundingDTO
  ): Promise<InitializeUserWalletFundingResponse> {
    const userId = request.userId;
    const userEmail = request.email;
    const amountToFundWalletWith: number = request.amount;
    try {
      const existingUserWallet = await this.walletRepo.getWalletByUserId(
        userId
      );

      const doesUserWalletExists = !!existingUserWallet;
      if (!doesUserWalletExists) {
        return left(
          new InitializeUserWalletFundingErrors.UserWalletDoesNotExistsError(
            userId
          )
        ) as InitializeUserWalletFundingResponse;
      }

      const paymentServiceResponse =
        await this.paymentService.initializePayment({
          email: userEmail,
          amount: amountToFundWalletWith,
          currency: "NGN"
        });

      if (!paymentServiceResponse.status) {
        return left(
          new InitializeUserWalletFundingErrors.PaymentServiceInitializationError()
        ) as InitializeUserWalletFundingResponse;
      }

      const walletTransactionStatus: WalletTransactionStatus = "pending";
      const walletTransactionDebitWalletIdOrError = WalletId.create(
        new UniqueEntityID(this.paymentService.serviceName)
      );
      const walletTransactionType: WalletTransactionType = "wallet_funding";
      const walletTransactionAmountOrError = WalletTransactionAmount.create({
        amount: amountToFundWalletWith
      });
      const prevDebitWalletBalanceOrError = DebitWalletBalance.create({
        amount: 0
      });
      const newDebitWalletBalanceOrError = DebitWalletBalance.create({
        amount: -amountToFundWalletWith
      });
      const prevCreditWalletBalanceOrError = CreditWalletBalance.create({
        amount: existingUserWallet.walletBalance.value
      });
      const newCreditWalletBalanceOrError = CreditWalletBalance.create({
        amount: existingUserWallet.walletBalance.value + amountToFundWalletWith
      });
      const walletTransactionNarrationOrError =
        WalletTransactionNarration.create({ text: "" });
      const walletTransactionReferenceOrError =
        WalletTransactionReference.create({
          text: paymentServiceResponse.data.reference
        });

      const payloadResult = Result.combine([
        walletTransactionAmountOrError,
        walletTransactionDebitWalletIdOrError,
        newCreditWalletBalanceOrError,
        prevCreditWalletBalanceOrError,
        prevDebitWalletBalanceOrError,
        newDebitWalletBalanceOrError,
        walletTransactionReferenceOrError,
        walletTransactionNarrationOrError
      ]);
      if (payloadResult.isFailure) {
        return left(
          Result.fail<void>(payloadResult.getErrorValue())
        ) as InitializeUserWalletFundingResponse;
      }

      const prevCreditWalletBalance = prevCreditWalletBalanceOrError.getValue();
      const prevDebitWalletBalance = prevDebitWalletBalanceOrError.getValue();
      const newCreditWalletBalance = newCreditWalletBalanceOrError.getValue();
      const newDebitWalletBalance = newDebitWalletBalanceOrError.getValue();
      const walletTransactionNarration =
        walletTransactionNarrationOrError.getValue();
      const walletTransactionDebitWalletId =
        walletTransactionDebitWalletIdOrError.getValue();
      const walletTransactionCreditWalletId = existingUserWallet.walletId;
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
        ) as InitializeUserWalletFundingResponse;
      }

      const walletTransaction: WalletTransaction =
        walletTransactionOrError.getValue();

      await this.walletTransactionRepo.saveWalletFundingTransaction(
        walletTransaction
      );

      const payloadResponse: WalletFundingResponse = {
        paymentAuthorizationUrl: paymentServiceResponse.data.authorization_url,
        ref: paymentServiceResponse.data.reference
      };

      return right(Result.ok<WalletFundingResponse>(payloadResponse));
    } catch (err) {
      log(err);
      return left(
        new AppError.UnexpectedError(err)
      ) as InitializeUserWalletFundingResponse;
    }
  }
}
