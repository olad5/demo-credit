import { GetWalletByUserIdUseCase } from "./GetWalletByUserIdUseCase";
import { GetWalletByUserIdDTO } from "./GetWalletByUserIdDTO";
import * as GetWalletByUserIdErrors from "./GetWalletByUserIdErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import debug from "debug";
import * as express from "express";
import { DecodedExpressRequest } from "../../../users/infra/http/models/decodedRequest";
import { WalletMap } from "../../mappers/walletMap";

const log = debug("app:GetWalletByUserIdController");

export class GetWalletByUserIdController extends BaseController {
  private useCase: GetWalletByUserIdUseCase;

  constructor(useCase: GetWalletByUserIdUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(
    req: DecodedExpressRequest,
    res: express.Response
  ): Promise<any> {
    const dto: GetWalletByUserIdDTO = {
      userId: req.decoded.userId
    };
    try {
      const result = await this.useCase.execute(dto);
      if (!result.isRight()) {
        const error = result.value;

        switch (error.constructor) {
          case GetWalletByUserIdErrors.UserWalletNotFoundError:
            return this.notFound(res, error.getErrorValue().message);
          default:
            return this.fail(
              res,
              error.getErrorValue().message || error.getErrorValue()
            );
        }
      } else {
        const wallet = result.value.getValue();
        return this.ok(res, {
          wallet: WalletMap.toDTO(wallet)
        });
      }
    } catch (err) {
      log(err);
      return this.fail(res, err);
    }
  }
}
