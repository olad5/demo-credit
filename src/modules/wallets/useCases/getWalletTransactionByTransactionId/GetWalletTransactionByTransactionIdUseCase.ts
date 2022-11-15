import { left, Result, right } from "../../../../shared/core/Result";
import * as GetWalletTransactionByTransactionIdErrors from "./GetWalletTransactionByTransactionIdErrors";
import * as AppError from "../../../../shared/core/AppError";
import debug from "debug";
import { UseCase } from "../../../../shared/core/UseCase";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { Guard } from "../../../../shared/core/Guard";
import { GetWalletTransactionByTransactionIdResponse } from "./GetWalletTransactionByTransactionIdResponse";
import { GetWalletTransactionByTransactionIdDTO } from "./GetWalletTransactionByTransactionIdDTO";
import { IWalletTransactionRepo } from "../../repos/walletTransactionRepo";
import { WalletTransaction } from "../../domain/walletTransaction";

const log = debug("app:GetWalletTransactionByTransactionIdUseCase");

export class GetWalletTransactionByTransactionIdUseCase
  implements
    UseCase<
      GetWalletTransactionByTransactionIdDTO,
      Promise<GetWalletTransactionByTransactionIdResponse>
    >
{
  private walletTransactionRepo: IWalletTransactionRepo;

  constructor(walletTransactionRepo: IWalletTransactionRepo) {
    this.walletTransactionRepo = walletTransactionRepo;
  }

  async execute(
    request: GetWalletTransactionByTransactionIdDTO
  ): Promise<GetWalletTransactionByTransactionIdResponse> {
    try {
      const guardResult = Guard.againstNullOrUndefined(
        request.transactionId,
        "transactionId"
      );

      const transactionId = TextUtils.sanitize(request.transactionId);
      if (guardResult.isFailure) {
        return left(
          new AppError.NullOrUndefinedFieldsError(guardResult.getErrorValue())
        );
      }
      const walletTransaction =
        await this.walletTransactionRepo.getWalletTransactionByTransactionId(
          transactionId
        );
      const walletTransactionFound = !!walletTransaction === true;

      if (!walletTransactionFound) {
        return left(
          new GetWalletTransactionByTransactionIdErrors.WalletTransactionNotFoundError(
            transactionId
          )
        ) as GetWalletTransactionByTransactionIdResponse;
      }

      return right(Result.ok<WalletTransaction>(walletTransaction));
    } catch (err) {
      log(err);
      return left(new AppError.UnexpectedError(err));
    }
  }
}
