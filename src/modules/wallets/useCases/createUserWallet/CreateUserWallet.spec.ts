import { CreateUserWalletUseCase } from "./CreateUserWalletUseCase";
import { CreateUserWalletResponse } from "./CreateUserWalletResponse";
import { WalletRepoSpy } from "../../__test__/utils/testObjects/walletRepoSpy";
import * as generate from "../../../../shared/utils/tests/generate";
import * as path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";
import { UserId } from "../../../users/domain/userId";

const feature = loadFeature(path.join(__dirname, "./CreateUserWallet.feature"));

defineFeature(feature, (test) => {
  let result: CreateUserWalletResponse;
  let userId: UserId;

  let walletRepoSpy: WalletRepoSpy;
  let createUserWallet: CreateUserWalletUseCase;

  beforeEach(() => {
    walletRepoSpy = new WalletRepoSpy([]);
    createUserWallet = new CreateUserWalletUseCase(walletRepoSpy);
  });

  test("Creating a user Wallet", ({ given, when, then }) => {
    given("I provide a valid userId", () => {
      walletRepoSpy = new WalletRepoSpy([]);
      createUserWallet = new CreateUserWalletUseCase(walletRepoSpy);
    });

    when("I attempt to create a user wallet", async () => {
      userId = generate.domainUserId();
      result = await createUserWallet.execute({ userId });
    });

    then("the user wallet should be saved successfully", () => {
      expect(result.isRight()).toEqual(true);
      expect(walletRepoSpy.getTimesWriteCalled()).toEqual(1);
      expect(walletRepoSpy.getWalletUndertest().userId).toEqual(userId);
    });
  });

  test("Creating a user Wallet with starting balance of 0", ({
    given,
    when,
    then
  }) => {
    given("I provide a valid userId", () => {
      walletRepoSpy = new WalletRepoSpy([]);
      createUserWallet = new CreateUserWalletUseCase(walletRepoSpy);
    });

    when("I attempt to create a user wallet", async () => {
      userId = generate.domainUserId();
      result = await createUserWallet.execute({ userId });
    });

    then(
      "the user wallet should be saved successfully with a balance of 0",
      () => {
        expect(result.isRight()).toEqual(true);
        expect(walletRepoSpy.getTimesWriteCalled()).toEqual(1);
        expect(walletRepoSpy.getWalletUndertest().walletBalance.value).toEqual(
          0
        );
      }
    );
  });

  test("Wallet already exists", ({ given, when, then }) => {
    given("I provide an valid userId", () => {
      walletRepoSpy = new WalletRepoSpy([]);
      createUserWallet = new CreateUserWalletUseCase(walletRepoSpy);
    });

    when(
      "I attempt to create a wallet for a user that already has a wallet",
      async () => {
        userId = generate.domainUserId();
        await createUserWallet.execute({ userId });
        result = await createUserWallet.execute({ userId });
      }
    );

    then("I should get a user wallet already exists error", () => {
      const errorMessage = `The user with userId ${userId.id.toString()} already has a wallet`;
      expect(result.isLeft()).toEqual(true);
      expect(result.value.getErrorValue().message).toEqual(errorMessage);
      expect(walletRepoSpy.getTimesWriteCalled()).toEqual(1);
    });
  });
});
