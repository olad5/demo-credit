import { InitializeUserWalletFundingUseCase } from "./InitializeUserWalletFundingUseCase";
import { InitializeUserWalletFundingResponse } from "./InitializeUserWalletFundingResponse";
import * as InitializeUserWalletFundingErrors from "./InitializeUserWalletFundingErrors";
import * as generate from "../../../../shared/utils/tests/generate";
import { WalletRepoSpy } from "../../__test__/utils/testObjects/walletRepoSpy";
import { WalletTransactionRepoSpy } from "../../__test__/utils/testObjects/walletTransactionRepoSpy";
import { PaymentServiceSpy } from "../../__test__/utils/testObjects/paymentServiceSpy";
import * as path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";
import { Wallet } from "../../domain/wallet";

const feature = loadFeature(
  path.join(__dirname, "./InitializeUserWalletFunding.feature")
);

defineFeature(feature, (test) => {
  let result: InitializeUserWalletFundingResponse;
  let walletRepoSpy: WalletRepoSpy;
  let userWallet: Wallet;
  let walletTransactionRepoSpy: WalletTransactionRepoSpy;
  let paymentServiceSpy: PaymentServiceSpy;
  let initializeUserWalletFunding: InitializeUserWalletFundingUseCase;

  beforeEach(() => {
    walletRepoSpy = new WalletRepoSpy([]);
    userWallet = undefined;
    walletTransactionRepoSpy = new WalletTransactionRepoSpy([], walletRepoSpy);
    paymentServiceSpy = new PaymentServiceSpy();
    initializeUserWalletFunding = new InitializeUserWalletFundingUseCase(
      walletTransactionRepoSpy,
      walletRepoSpy,
      paymentServiceSpy
    );
  });

  test("Initializing a user Wallet Funding", ({ given, when, then }) => {
    const userId = generate.domainUserId();
    const amountToFundWalletWith = 10;
    given("I provide a valid amount", () => {
      userWallet = generate.buildDomainWallet(userId);
      walletRepoSpy = new WalletRepoSpy([userWallet]);
      initializeUserWalletFunding = new InitializeUserWalletFundingUseCase(
        walletTransactionRepoSpy,
        walletRepoSpy,
        paymentServiceSpy
      );
    });

    when(
      "I attempt to initialize a funding process for a user's wallet",
      async () => {
        result = await initializeUserWalletFunding.execute({
          amount: amountToFundWalletWith,
          ...generate.buildUser({ userId: userId.id.toString() })
        });
      }
    );

    then(
      "the wallet funding should be successfully with a pending status",
      () => {
        expect(result.isRight()).toEqual(true);
        expect(paymentServiceSpy.getTimesInitializePaymentCalled()).toEqual(1);
        expect(
          walletTransactionRepoSpy.getTimesWalletFundingSaveCalled()
        ).toEqual(1);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().status
        ).toEqual("pending");
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().amount.value
        ).toEqual(amountToFundWalletWith);
      }
    );
  });

  test("Payment Service Error", ({ given, when, then }) => {
    const userId = generate.domainUserId();
    const amountToFundWalletWith = 10;
    given("I provide a valid userId", () => {
      userWallet = generate.buildDomainWallet(userId);
      walletRepoSpy = new WalletRepoSpy([userWallet]);
      paymentServiceSpy = new PaymentServiceSpy();
      const paymentServiceStatus = false;
      paymentServiceSpy.changeResponseStatus(paymentServiceStatus);
      initializeUserWalletFunding = new InitializeUserWalletFundingUseCase(
        walletTransactionRepoSpy,
        walletRepoSpy,
        paymentServiceSpy
      );
    });

    when(
      "I attempt to create a user wallet but the payment Service fails",
      async () => {
        result = await initializeUserWalletFunding.execute({
          amount: amountToFundWalletWith,
          ...generate.buildUser({ userId: userId.id.toString() })
        });
      }
    );

    then(
      "the wallet transaction should happen and I should get a payment service error",
      () => {
        const error =
          new InitializeUserWalletFundingErrors.PaymentServiceInitializationError().getErrorValue();
        expect(result.isLeft()).toEqual(true);
        expect(result.value.getErrorValue()).toEqual(error);
        expect(paymentServiceSpy.getTimesInitializePaymentCalled()).toEqual(1);
        expect(
          walletTransactionRepoSpy.getTimesWalletFundingSaveCalled()
        ).toEqual(0);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest()
        ).toEqual(undefined);
      }
    );
  });
});
