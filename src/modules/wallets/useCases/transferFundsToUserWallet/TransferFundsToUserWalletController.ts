import { TransferFundsToUserWalletUseCase } from "./TransferFundsToUserWalletUseCase";
import { TransferFundsToUserWalletDTO } from "./TransferFundsToUserWalletDTO";
import * as TransferFundsToUserWalletErrors from "./TransferFundsToUserWalletErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import debug from "debug";
import * as express from "express";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";

const log = debug("app:TransferFundsToUserWalletController");

export class TransferFundsToUserWalletController extends BaseController {
  private useCase: TransferFundsToUserWalletUseCase;

  constructor(useCase: TransferFundsToUserWalletUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: TransferFundsToUserWalletDTO = {
      senderUserId: req.decoded.userId,
      ...req.body
    };

    try {
      const result = await this.useCase.execute(dto);
      if (!result.isRight()) {
        const error = result.value;

        switch (error.constructor) {
          case TransferFundsToUserWalletErrors.InsufficientFundsError:
            return this.forbidden(res, error.getErrorValue().message);
          case TransferFundsToUserWalletErrors.CannotSendMoneyToSelfError:
            return this.forbidden(res, error.getErrorValue().message);
          case TransferFundsToUserWalletErrors.UserWalletNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(
              res,
              error.getErrorValue().message || error.getErrorValue()
            );
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      log(err);
      return this.fail(res, err);
    }
  }
}
