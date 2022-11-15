import { GetWalletTransactionByTransactionIdUseCase } from "./GetWalletTransactionByTransactionIdUseCase";
import { GetWalletTransactionByTransactionIdDTO } from "./GetWalletTransactionByTransactionIdDTO";
import * as GetWalletTransactionByTransactionIdErrors from "./GetWalletTransactionByTransactionIdErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import debug from "debug";
import * as express from "express";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";
import { WalletTransactionMap } from "../../mappers/walletTransactionMap";

const log = debug("app:GetWalletTransactionByTransactionIdController");

export class GetWalletTransactionByTransactionIdController extends BaseController {
  private useCase: GetWalletTransactionByTransactionIdUseCase;

  constructor(useCase: GetWalletTransactionByTransactionIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: GetWalletTransactionByTransactionIdDTO = {
      transactionId:
        req.params.transactionId === ":transactionId"
          ? undefined
          : req.params.transactionId
    };
    try {
      const result = await this.useCase.execute(dto);
      if (!result.isRight()) {
        const error = result.value;

        switch (error.constructor) {
          case GetWalletTransactionByTransactionIdErrors.WalletTransactionNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(
              res,
              error.getErrorValue().message || error.getErrorValue()
            );
        }
      } else {
        const walletTransaction = result.value.getValue();
        return this.ok(res, {
          walletTransaction: WalletTransactionMap.toDTO(walletTransaction)
        });
      }
    } catch (err) {
      log(err);
      return this.fail(res, err);
    }
  }
}
