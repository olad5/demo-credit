import { PaymentServiceSpy } from "../../__test__/utils/testObjects/paymentServiceSpy";
import { FundUserWalletUseCase } from "./FundUserWalletUseCase";
import * as FundUserWalletErrors from "./FundUserWalletErrors";
import { FundUserWalletResponse } from "./FundUserWalletResponse";
import * as generate from "../../../../shared/utils/tests/generate";
import { WalletRepoSpy } from "../../__test__/utils/testObjects/walletRepoSpy";
import { WalletTransactionRepoSpy } from "../../__test__/utils/testObjects/walletTransactionRepoSpy";
import * as path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";

const feature = loadFeature(path.join(__dirname, "./FundUserWallet.feature"));
defineFeature(feature, (test) => {
  let result: FundUserWalletResponse;
  let walletRepoSpy: WalletRepoSpy;
  let paymentServiceSpy: PaymentServiceSpy;
  let walletTransactionRepoSpy: WalletTransactionRepoSpy;
  let fundUserWallet: FundUserWalletUseCase;

  beforeEach(() => {
    walletRepoSpy = new WalletRepoSpy([]);
    paymentServiceSpy = new PaymentServiceSpy();
    walletTransactionRepoSpy = new WalletTransactionRepoSpy([], walletRepoSpy);
    fundUserWallet = new FundUserWalletUseCase(
      walletRepoSpy,
      walletTransactionRepoSpy,
      paymentServiceSpy
    );
  });

  test("Add Funds to User's Wallet", ({ given, when, then }) => {
    const recipientUserId = generate.domainUserId();
    const amountToFundWalletWith = 10;
    const {
      amount,
      prevDebitWalletBalance,
      prevCreditWalletBalance,
      newDebitWalletBalance,
      newCreditWalletBalance
    } = generate.generateRandomAmountWithPrevAndNewBalances(
      amountToFundWalletWith
    );
    const currentCreditWalletBalance = prevCreditWalletBalance;
    const creditWallet = generate.buildDomainWallet(
      recipientUserId,
      currentCreditWalletBalance
    );
    const initialWalletFundingTransaction =
      generate.buildDomainWalletTransaction({
        amount: amount,
        status: "pending",
        transactionType: "wallet_funding",
        debitWalletId: "paystack",
        creditWalletId: creditWallet.walletId.id.toString(),
        prevDebitWalletBalance,
        prevCreditWalletBalance,
        newCreditWalletBalance,
        newDebitWalletBalance
      });
    given(
      "I provide a valid wallet Transaction that has the reference of the initialized wallet funding transaction",
      () => {
        walletRepoSpy = new WalletRepoSpy([creditWallet]);
        walletTransactionRepoSpy = new WalletTransactionRepoSpy(
          [initialWalletFundingTransaction],
          walletRepoSpy
        );
        fundUserWallet = new FundUserWalletUseCase(
          walletRepoSpy,
          walletTransactionRepoSpy,
          paymentServiceSpy
        );
      }
    );

    when(
      "I attempt to update the user's wallet with the added funds",
      async () => {
        result = await fundUserWallet.execute({
          pendingWalletTransaction: initialWalletFundingTransaction
        });
      }
    );

    then("the update of the user's wallet should be successfully", async () => {
      const transactionsHavingSameReference =
        await walletTransactionRepoSpy.getTransactionsByReference(
          initialWalletFundingTransaction.ref.value
        );

      const transactionsStatuses = transactionsHavingSameReference.map((trx) =>
        trx.status.toString()
      );

      const doesTransactionsHaveTheSameAmount =
        transactionsHavingSameReference[1].amount.equals(
          transactionsHavingSameReference[0].amount
        );
      const updatedCreditWallet = await walletRepoSpy.getWalletByWalletId(
        creditWallet.walletId.id.toString()
      );
      const didCreditWalletGetUpdatedWithFunds =
        updatedCreditWallet.walletBalance.value ===
        prevCreditWalletBalance + amountToFundWalletWith;

      expect(result.isRight()).toEqual(true);
      expect(paymentServiceSpy.getTimesVerifyPaymentCalled()).toEqual(1);
      expect(transactionsHavingSameReference.length).toEqual(2);
      expect(doesTransactionsHaveTheSameAmount).toEqual(true);
      expect(transactionsStatuses).toEqual(["pending", "success"]);
      expect(
        walletTransactionRepoSpy.getWalletTransactionUndertest().ref.value
          .length
      ).toEqual(20);
      expect(didCreditWalletGetUpdatedWithFunds).toEqual(true);
    });
  });

  test("Funding from payment service failed", ({ given, when, then }) => {
    const recipientUserId = generate.domainUserId();
    const amountToFundWalletWith = 20;
    const {
      amount,
      prevDebitWalletBalance,
      prevCreditWalletBalance,
      newDebitWalletBalance,
      newCreditWalletBalance
    } = generate.generateRandomAmountWithPrevAndNewBalances(
      amountToFundWalletWith
    );
    const currentCreditWalletBalance = prevCreditWalletBalance;
    const creditWallet = generate.buildDomainWallet(
      recipientUserId,
      currentCreditWalletBalance
    );
    const initialWalletFundingTransaction =
      generate.buildDomainWalletTransaction({
        amount: amount,
        status: "pending",
        transactionType: "wallet_funding",
        debitWalletId: "paystack",
        creditWalletId: creditWallet.walletId.id.toString(),
        prevDebitWalletBalance,
        prevCreditWalletBalance,
        newCreditWalletBalance,
        newDebitWalletBalance
      });
    given(
      "I provide a reference of the initialized wallet funding transaction",
      () => {
        walletRepoSpy = new WalletRepoSpy([creditWallet]);
        walletTransactionRepoSpy = new WalletTransactionRepoSpy(
          [initialWalletFundingTransaction],
          walletRepoSpy
        );
        paymentServiceSpy.changeVerifyPaymentDataStatus("failed");
        fundUserWallet = new FundUserWalletUseCase(
          walletRepoSpy,
          walletTransactionRepoSpy,
          paymentServiceSpy
        );
      }
    );

    when(
      "I attempt to update the user's wallet with the added funds, the payment service response with a failed status",
      async () => {
        result = await fundUserWallet.execute({
          pendingWalletTransaction: initialWalletFundingTransaction
        });
      }
    );

    then("the update of the user's wallet should be not happen", async () => {
      const error = new FundUserWalletErrors.PaymentInitailizedFailedError(
        "failed"
      ).getErrorValue();
      expect(paymentServiceSpy.getTimesVerifyPaymentCalled()).toEqual(1);
      expect(result.isRight()).toEqual(false);
      expect(result.value.getErrorValue()).toEqual(error);
    });
  });
});
