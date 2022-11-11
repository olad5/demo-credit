import { UserCreated } from "../../users/domain/events/userCreated";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import debug from "debug";
import { CreateUserWalletUseCase } from "../useCases/createUserWallet/CreateUserWalletUseCase";

const log = debug("app:AfterUserCreated-handler");

export class AfterUserCreated implements IHandle<UserCreated> {
  private createUserWalletUseCase: CreateUserWalletUseCase;

  constructor(createUserWalletUseCase: CreateUserWalletUseCase) {
    this.setupSubscriptions();
    this.createUserWalletUseCase = createUserWalletUseCase;
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.onUserCreated.bind(this), UserCreated.name);
    log("setup setupSubscriptions in the AfterUserCreated-handler");
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event;

    try {
      await this.createUserWalletUseCase.execute({
        userId: user.userId
      });
      log(
        `[AfterUserCreated]: Successfully executed createUserWallet use case AfterUserCreated`
      );
    } catch (err) {
      log(
        `[AfterUserCreated]: Failed to execute createUserWallet use case AfterUserCreated.`
      );
    }
  }
}
