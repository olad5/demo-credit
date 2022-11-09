import { CreateUserDTO } from "./CreateUserDTO";
import * as CreateUserErrors from "./CreateUserErrors";
import * as UserErrors from "../../errors/index";
import { Result, left, right } from "../../../../shared/core/Result";
import * as AppError from "../../../../shared/core/AppError";
import { IUserRepo } from "../../repos/userRepo";
import { UseCase } from "../../../../shared/core/UseCase";
import { UserEmail } from "../../domain/userEmail";
import { UserPassword } from "../../domain/userPassword";
import { User } from "../../domain/user";
import { UserFirstName } from "../../domain/userFirstName";
import { UserLastName } from "../../domain/userLastName";
import { CreateUserResponse } from "./CreateUserResponse";
import debug from "debug";
import { TextUtils } from "../../../../shared/utils/TextUtils";
import { Guard } from "../../../../shared/core/Guard";

const log = debug("app:CreateUserUseCase");

export class CreateUserUseCase
  implements UseCase<CreateUserDTO, Promise<CreateUserResponse>>
{
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  private sanitizeDto(request: CreateUserDTO): CreateUserDTO {
    return (request = {
      email: TextUtils.sanitize(request.email),
      firstName: TextUtils.sanitize(request.firstName),
      lastName: TextUtils.sanitize(request.lastName),
      password: request.password
    });
  }

  async execute(request: CreateUserDTO): Promise<CreateUserResponse> {
    const guardResult = Guard.againstNullOrUndefinedBulk([
      { argument: request.firstName, argumentName: "firstName" },
      { argument: request.lastName, argumentName: "lastname" },
      { argument: request.email, argumentName: "email" },
      { argument: request.password, argumentName: "password" }
    ]);

    if (guardResult.isFailure) {
      return left(
        new UserErrors.NullOrUndefinedFieldsError(guardResult.getErrorValue())
      );
    }

    const sanitizedDTO = this.sanitizeDto(request);

    const emailOrError = UserEmail.create(sanitizedDTO.email);
    const passwordOrError = UserPassword.create({
      value: sanitizedDTO.password
    });
    const firstnameOrError = UserFirstName.create({
      name: sanitizedDTO.firstName
    });
    const lastnameOrError = UserLastName.create({
      name: sanitizedDTO.lastName
    });

    const payloadResult = Result.combine([
      emailOrError,
      passwordOrError,
      firstnameOrError,
      lastnameOrError
    ]);

    if (payloadResult.isFailure) {
      return left(
        Result.fail<void>(payloadResult.getErrorValue())
      ) as CreateUserResponse;
    }

    const email: UserEmail = emailOrError.getValue();
    const password: UserPassword = passwordOrError.getValue();
    const firstname: UserFirstName = firstnameOrError.getValue();
    const lastname: UserFirstName = lastnameOrError.getValue();

    try {
      const existingUser = await this.userRepo.getUserByEmail(email.value);
      const userAlreadyExists = !!existingUser;

      if (userAlreadyExists) {
        return left(
          new CreateUserErrors.EmailAlreadyExistsError(email.value)
        ) as CreateUserResponse;
      }

      const userOrError: Result<User> = User.create({
        email,
        password,
        firstname,
        lastname
      });

      if (userOrError.isFailure) {
        return left(
          Result.fail<User>(userOrError.getErrorValue().toString())
        ) as CreateUserResponse;
      }

      const user: User = userOrError.getValue();

      await this.userRepo.save(user);

      return right(Result.ok<void>());
    } catch (err) {
      log(err);
      return left(new AppError.UnexpectedError(err)) as CreateUserResponse;
    }
  }
}
