import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserDTO } from "./CreateUserDTO";
import * as UserErrors from "../../errors/index";
import * as CreateUserErrors from "./CreateUserErrors";
import { BaseController } from "../../../../shared/infra/http/models/BaseController";
import debug from "debug";
import * as express from "express";

const log = debug("app:CreateUserController");

export class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateUserDTO = req.body as CreateUserDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (!result.isRight()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.getErrorValue().message);
          case UserErrors.NullOrUndefinedFieldsError:
            return this.forbidden(res, error.getErrorValue().message);
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
