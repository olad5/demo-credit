import { left, Result, right } from "../../../../shared/core/Result";
import * as WalletErrors from "../../errors/index";
import * as AppError from "../../../../shared/core/AppError";
import debug from "debug";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetRecentWalletTransactionsResponse } from "./GetRecentWalletTransactionsResponse";
import { GetRecentWalletTransactionsDTO } from "./GetRecentWalletTransactionsDTO";
import { IWalletRepo } from "../../repos/walletRepo";
import { IWalletTransactionRepo } from "../../repos/walletTransactionRepo";
import { WalletTransaction } from "../../domain/walletTransaction";

const log = debug("app:GetRecentWalletTransactionsUseCase");

export class GetRecentWalletTransactionsUseCase
  implements
    UseCase<
      GetRecentWalletTransactionsDTO,
      Promise<GetRecentWalletTransactionsResponse>
    >
{
  private walletrepo: IWalletRepo;
  private walletTransactionRepo: IWalletTransactionRepo;

  constructor(
    walletRepo: IWalletRepo,
    walletTransactionRepo: IWalletTransactionRepo
  ) {
    this.walletrepo = walletRepo;
    this.walletTransactionRepo = walletTransactionRepo;
  }

  async execute(
    request: GetRecentWalletTransactionsDTO
  ): Promise<GetRecentWalletTransactionsResponse> {
    try {
      const userId = request.userId;
      const wallet = await this.walletrepo.getWalletByUserId(userId);
      const walletFound = !!wallet === true;
      if (!walletFound) {
        return left(
          new WalletErrors.UserWalletNotFoundError(userId)
        ) as GetRecentWalletTransactionsResponse;
      }

      const walletTransactions =
        await this.walletTransactionRepo.getRecentsWalletTransactionByWalletId(
          wallet
        );

      return right(Result.ok<WalletTransaction[]>(walletTransactions));
    } catch (err) {
      log(err);
      return left(new AppError.UnexpectedError(err));
    }
  }
}
