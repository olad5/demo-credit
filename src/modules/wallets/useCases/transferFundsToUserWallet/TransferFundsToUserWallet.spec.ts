import { TransferFundsToUserWalletUseCase } from "./TransferFundsToUserWalletUseCase";
import * as TransferFundsToUserWalletErrors from "./TransferFundsToUserWalletErrors";
import { TransferFundsToUserWalletResponse } from "./TransferFundsToUserWalletResponse";
import * as generate from "../../../../shared/utils/tests/generate";
import { WalletRepoSpy } from "../../__test__/utils/testObjects/walletRepoSpy";
import { WalletTransactionRepoSpy } from "../../__test__/utils/testObjects/walletTransactionRepoSpy";
import * as path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";
import { Wallet } from "../../domain/wallet";

const feature = loadFeature(
  path.join(__dirname, "./TransferFundsToUserWallet.feature")
);

defineFeature(feature, (test) => {
  let result: TransferFundsToUserWalletResponse;
  let walletRepoSpy: WalletRepoSpy;
  let creditWallet: Wallet;
  let debitWallet: Wallet;
  let walletTransactionRepoSpy: WalletTransactionRepoSpy;
  let transferFundsToUserWallet: TransferFundsToUserWalletUseCase;

  beforeEach(() => {
    walletRepoSpy = new WalletRepoSpy([]);
    debitWallet = undefined;
    creditWallet = undefined;
    walletTransactionRepoSpy = new WalletTransactionRepoSpy([], walletRepoSpy);
    transferFundsToUserWallet = new TransferFundsToUserWalletUseCase(
      walletTransactionRepoSpy,
      walletRepoSpy
    );
  });

  test("Transfer to another User Wallet", ({ given, when, then }) => {
    const senderUserId = generate.domainUserId();
    const recipientUserId = generate.domainUserId();
    const narration = "Testing wallet to wallet transfer";
    const amountToTransfer = 10;
    given("I provide a valid amount and a valid recipient userId", () => {
      const currentDebitWalletBalance = 90;
      debitWallet = generate.buildDomainWallet(
        senderUserId,
        currentDebitWalletBalance
      );
      creditWallet = generate.buildDomainWallet(recipientUserId);
      walletRepoSpy = new WalletRepoSpy([debitWallet, creditWallet]);
      walletTransactionRepoSpy = new WalletTransactionRepoSpy(
        [],
        walletRepoSpy
      );
      transferFundsToUserWallet = new TransferFundsToUserWalletUseCase(
        walletTransactionRepoSpy,
        walletRepoSpy
      );
    });

    when("I attempt to transfer funds to another user's wallet", async () => {
      result = await transferFundsToUserWallet.execute({
        amount: amountToTransfer,
        narration,
        senderUserId: senderUserId.id.toString(),
        recipientUserId: recipientUserId.id.toString()
      });
    });

    then(
      "the transfer of funds should be successfully with a success status",
      async () => {
        expect(result.isRight()).toEqual(true);
        expect(
          walletTransactionRepoSpy.getTimesWalletToWalletSaveCalled()
        ).toEqual(1);
        expect(walletRepoSpy.getTimesSaveBulkCalled()).toEqual(1);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().status
        ).toEqual("success");
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().amount.value
        ).toEqual(amountToTransfer);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().ref.value
            .length
        ).toEqual(20);
      }
    );
  });
  test("Transfer to another User Wallet balance sheet is correct", ({
    given,
    when,
    then
  }) => {
    const senderUserId = generate.domainUserId();
    const recipientUserId = generate.domainUserId();
    const narration = "Testing wallet to wallet transfer";
    const amountToTransfer = 10;
    given("I provide a valid amount and a valid recipient userId", () => {
      const currentDebitWalletBalance = 90;
      debitWallet = generate.buildDomainWallet(
        senderUserId,
        currentDebitWalletBalance
      );
      creditWallet = generate.buildDomainWallet(recipientUserId);
      walletRepoSpy = new WalletRepoSpy([debitWallet, creditWallet]);
      walletTransactionRepoSpy = new WalletTransactionRepoSpy(
        [],
        walletRepoSpy
      );
      transferFundsToUserWallet = new TransferFundsToUserWalletUseCase(
        walletTransactionRepoSpy,
        walletRepoSpy
      );
    });

    when("I attempt to transfer funds to another user's wallet", async () => {
      result = await transferFundsToUserWallet.execute({
        amount: amountToTransfer,
        narration,
        senderUserId: senderUserId.id.toString(),
        recipientUserId: recipientUserId.id.toString()
      });
    });

    then(
      "the sum of the difference in the debit wallet and the difference in the credit wallet should equal 0",
      async () => {
        const newDebitWalletBalance =
          debitWallet.walletBalance.value - amountToTransfer;
        const newCreditWalletBalance =
          creditWallet.walletBalance.value + amountToTransfer;
        const updatedDebitWallet = await walletRepoSpy.getWalletByUserId(
          senderUserId.id.toString()
        );
        const updatedCreditWallet = await walletRepoSpy.getWalletByUserId(
          recipientUserId.id.toString()
        );
        const differenceInDebitWallet: number =
          newDebitWalletBalance - debitWallet.walletBalance.value;
        const differenceInCreditWallet: number =
          newCreditWalletBalance - creditWallet.walletBalance.value;

        expect(walletRepoSpy.getTimesSaveBulkCalled()).toEqual(1);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().status
        ).toEqual("success");
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest().amount.value
        ).toEqual(amountToTransfer);

        expect(updatedDebitWallet.walletBalance.value).toEqual(
          newDebitWalletBalance
        );
        expect(updatedCreditWallet.walletBalance.value).toEqual(
          newCreditWalletBalance
        );
        expect(differenceInDebitWallet + differenceInCreditWallet).toEqual(0);
        expect(updatedDebitWallet.walletId.id.toString()).toEqual(
          debitWallet.walletId.id.toString()
        );
        expect(updatedCreditWallet.walletId.id.toString()).toEqual(
          creditWallet.walletId.id.toString()
        );
      }
    );
  });

  test("Transfer to Self", ({ given, when, then }) => {
    const senderUserId = generate.domainUserId();
    const recipientUserId = senderUserId;
    const narration = "Testing wallet to wallet transfer";
    const amountToTransfer = 10;
    given(
      "I provide a valid amount and my userId as the recipient userId",
      () => {
        const currentDebitWalletBalance = 90;
        debitWallet = generate.buildDomainWallet(
          senderUserId,
          currentDebitWalletBalance
        );
        creditWallet = debitWallet;
        walletRepoSpy = new WalletRepoSpy([debitWallet, creditWallet]);
        walletTransactionRepoSpy = new WalletTransactionRepoSpy(
          [],
          walletRepoSpy
        );
        transferFundsToUserWallet = new TransferFundsToUserWalletUseCase(
          walletTransactionRepoSpy,
          walletRepoSpy
        );
      }
    );

    when("I attempt to transfer funds to my wallet", async () => {
      result = await transferFundsToUserWallet.execute({
        amount: amountToTransfer,
        narration,
        senderUserId: senderUserId.id.toString(),
        recipientUserId: recipientUserId.id.toString()
      });
    });

    then(
      "the process fails and wallet is not debited nor credited",
      async () => {
        expect(result.isRight()).toEqual(false);
        const error =
          new TransferFundsToUserWalletErrors.CannotSendMoneyToSelfError();

        expect(result.value.getErrorValue()).toEqual(error.getErrorValue());
        expect(walletRepoSpy.getTimesSaveBulkCalled()).toEqual(0);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest()
        ).toEqual(undefined);
      }
    );
  });

  test("Insufficient Funds", ({ given, when, then }) => {
    const senderUserId = generate.domainUserId();
    const recipientUserId = generate.domainUserId();
    const narration = "Testing wallet to wallet transfer";
    const amountToTransfer = 100;
    given(
      "I provide a valid recipient userId and an amount greater than my current wallet balance",
      () => {
        const currentDebitWalletBalance = 90;
        debitWallet = generate.buildDomainWallet(
          senderUserId,
          currentDebitWalletBalance
        );
        creditWallet = generate.buildDomainWallet(recipientUserId);
        walletRepoSpy = new WalletRepoSpy([debitWallet, creditWallet]);
        walletTransactionRepoSpy = new WalletTransactionRepoSpy(
          [],
          walletRepoSpy
        );
        transferFundsToUserWallet = new TransferFundsToUserWalletUseCase(
          walletTransactionRepoSpy,
          walletRepoSpy
        );
      }
    );

    when("I attempt to transfer funds to another user's wallet", async () => {
      result = await transferFundsToUserWallet.execute({
        amount: amountToTransfer,
        narration,
        senderUserId: senderUserId.id.toString(),
        recipientUserId: recipientUserId.id.toString()
      });
    });

    then(
      "the process fails and I get an Insufficient funds error message",
      async () => {
        expect(result.isRight()).toEqual(false);
        const error =
          new TransferFundsToUserWalletErrors.InsufficientFundsError(
            senderUserId.id.toString()
          );

        expect(result.value.getErrorValue()).toEqual(error.getErrorValue());
        expect(walletRepoSpy.getTimesSaveBulkCalled()).toEqual(0);
        expect(
          walletTransactionRepoSpy.getWalletTransactionUndertest()
        ).toEqual(undefined);
      }
    );
  });
});
