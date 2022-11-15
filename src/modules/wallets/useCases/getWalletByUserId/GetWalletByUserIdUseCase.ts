import { left, Result, right } from "../../../../shared/core/Result";
import * as GetWalletByUserIdErrors from "./GetWalletByUserIdErrors";
import * as AppError from "../../../../shared/core/AppError";
import debug from "debug";
import { UseCase } from "../../../../shared/core/UseCase";
import { GetWalletByUserIdResponse } from "./GetWalletByUserIdResponse";
import { GetWalletByUserIdDTO } from "./GetWalletByUserIdDTO";
import { IWalletRepo } from "../../repos/walletRepo";
import { Wallet } from "../../domain/wallet";

const log = debug("app:GetWalletByUserIdUseCase");

export class GetWalletByUserIdUseCase
  implements UseCase<GetWalletByUserIdDTO, Promise<GetWalletByUserIdResponse>>
{
  private walletrepo: IWalletRepo;

  constructor(walletRepo: IWalletRepo) {
    this.walletrepo = walletRepo;
  }

  async execute(
    request: GetWalletByUserIdDTO
  ): Promise<GetWalletByUserIdResponse> {
    try {
      const userId = request.userId;
      const wallet = await this.walletrepo.getWalletByUserId(userId);
      const walletFound = !!wallet === true;

      if (!walletFound) {
        return left(
          new GetWalletByUserIdErrors.UserWalletNotFoundError(userId)
        ) as GetWalletByUserIdResponse;
      }

      return right(Result.ok<Wallet>(wallet));
    } catch (err) {
      log(err);
      return left(new AppError.UnexpectedError(err));
    }
  }
}
