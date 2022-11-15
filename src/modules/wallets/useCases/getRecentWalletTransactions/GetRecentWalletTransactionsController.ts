import { GetRecentWalletTransactionsUseCase } from "./GetRecentWalletTransactionsUseCase";
import { GetRecentWalletTransactionsDTO } from "./GetRecentWalletTransactionsDTO";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import debug from "debug";
import * as express from "express";
import * as WalletErrors from "../../errors/index";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";
import { WalletTransactionMap } from "../../mappers/walletTransactionMap";

const log = debug("app:GetRecentWalletTransactionsController");

export class GetRecentWalletTransactionsController extends BaseController {
  private useCase: GetRecentWalletTransactionsUseCase;

  constructor(useCase: GetRecentWalletTransactionsUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: GetRecentWalletTransactionsDTO = {
      userId: req.decoded.userId
    };

    try {
      const result = await this.useCase.execute(dto);
      if (!result.isRight()) {
        const error = result.value;

        switch (error.constructor) {
          case WalletErrors.UserWalletNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(
              res,
              error.getErrorValue().message || error.getErrorValue()
            );
        }
      } else {
        const walletTransactions = result.value.getValue();
        return this.ok(res, {
          walletTransactions: walletTransactions.map((walletTransaction) =>
            WalletTransactionMap.toDTO(walletTransaction)
          )
        });
      }
    } catch (err) {
      log(err);
      return this.fail(res, err);
    }
  }
}
