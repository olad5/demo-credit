import { InitializeUserWalletFundingUseCase } from "./InitializeUserWalletFundingUseCase";
import { InitializeUserWalletFundingDTO } from "./InitializeUserWalletFundingDTO";
import * as InitializeUserWalletFundingErrors from "./InitializeUserWalletFundingErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import debug from "debug";
import * as express from "express";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";

const log = debug("app:InitializeUserWalletFundingController");

export class InitializeUserWalletFundingController extends BaseController {
  private useCase: InitializeUserWalletFundingUseCase;

  constructor(useCase: InitializeUserWalletFundingUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: InitializeUserWalletFundingDTO = {
      amount: req.body.amount,
      userId: req.decoded.userId,
      email: req.decoded.email
    };

    try {
      const result = await this.useCase.execute(dto);

      if (!result.isRight()) {
        const error = result.value;

        switch (error.constructor) {
          case InitializeUserWalletFundingErrors.PaymentServiceInitializationError:
            return this.fail(res, error.getErrorValue().message);
          case InitializeUserWalletFundingErrors.UserWalletDoesNotExistsError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(
              res,
              error.getErrorValue().message || error.getErrorValue()
            );
        }
      } else {
        const walletFundingResponse = result.value.getValue();
        return this.ok(res, walletFundingResponse);
      }
    } catch (err) {
      log(err);
      return this.fail(res, err);
    }
  }
}
