import debug from "debug";
import { LoginDTO, LoginDTOResponse } from "./LoginDTO";
import * as LoginUseCaseErrors from "./LoginErrors";
import * as AppError from "../../../../shared/core/AppError";
import { Result, left, right } from "../../../../shared/core/Result";
import { UseCase } from "../../../../shared/core/UseCase";
import { IUserRepo } from "../../repos/userRepo";
import { IAuthService } from "../../services/authService";
import { User } from "../../domain/user";
import { UserPassword } from "../../domain/userPassword";
import { JWTToken, RefreshToken } from "../../domain/jwt";
import { LoginResponse } from "./LoginResponse";
import { UserEmail } from "../../domain/userEmail";
import { TextUtils } from "../../../../shared/utils/TextUtils";

const log = debug("app:LoginUserUseCase");

export class LoginUserUseCase
  implements UseCase<LoginDTO, Promise<LoginResponse>>
{
  private userRepo: IUserRepo;
  private authService: IAuthService;

  constructor(userRepo: IUserRepo, authService: IAuthService) {
    this.userRepo = userRepo;
    this.authService = authService;
  }

  public async execute(request: LoginDTO): Promise<LoginResponse> {
    const sanitizedEmail = TextUtils.sanitize(request.email);
    const emailOrError = UserEmail.create(sanitizedEmail);
    const passwordOrError = UserPassword.create({ value: request.password });
    const payloadResult = Result.combine([emailOrError, passwordOrError]);

    if (payloadResult.isFailure) {
      return left(
        Result.fail<void>(payloadResult.getErrorValue())
      ) as LoginResponse;
    }
    try {
      const password: UserPassword = passwordOrError.getValue();

      const user: User = await this.userRepo.getUserByEmail(sanitizedEmail);
      const userFound = !!user;

      if (!userFound) {
        return left(new LoginUseCaseErrors.EmailDoesntExistError());
      }

      const passwordValid = await user.password.comparePassword(password.value);

      if (!passwordValid) {
        return left(new LoginUseCaseErrors.PasswordDoesntMatchError());
      }

      const accessToken: JWTToken = this.authService.signJWT({
        email: user.email.value,
        userId: user.userId.id.toString()
      });

      const refreshToken: RefreshToken = this.authService.createRefreshToken();

      user.setAccessToken(accessToken, refreshToken);

      await this.authService.saveAuthenticatedUser(user);

      return right(
        Result.ok<LoginDTOResponse>({
          accessToken,
          refreshToken
        })
      );
    } catch (err) {
      log(err);
      return left(new AppError.UnexpectedError(err.toString()));
    }
  }
}
