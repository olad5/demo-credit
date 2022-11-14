import { WalletTransaction } from "../../../domain/walletTransaction";
import { IWalletTransactionRepo } from "../../../repos/walletTransactionRepo";

export class WalletTransactionRepoSpy implements IWalletTransactionRepo {
  private walletTransactions: WalletTransaction[];
  private walletTransactionUnderTest: WalletTransaction;
  private timesWalletFundingSaveCalled: number;

  constructor(walletTransactions: WalletTransaction[]) {
    this.walletTransactions = walletTransactions;
    this.timesWalletFundingSaveCalled = 0;
  }

  async saveWalletFundingTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void> {
    this.walletTransactions.push(walletTransaction);
    this.timesWalletFundingSaveCalled++;
    this.walletTransactionUnderTest = walletTransaction;
  }

  /* eslint-disable */

  async saveWalletToWalletTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void> {}

  async saveWalletFundWithdrawalTransaction(
    walletTransaction: WalletTransaction
  ): Promise<void> {}

  /* eslint-enable */

  getWalletTransactionById(
    walletTransactionId: string
  ): Promise<WalletTransaction> {
    const found = this.walletTransactions.find(
      (walletTransaction) =>
        walletTransaction.walletTransactionId.id.toString() ===
        walletTransactionId
    );

    if (!found) {
      return undefined;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        this.walletTransactionUnderTest = found;
        resolve(found);
      }, 300);
    });
  }

  getTimesWalletFundingSaveCalled(): number {
    return this.timesWalletFundingSaveCalled;
  }

  getWalletTransactionUndertest(): WalletTransaction {
    return this.walletTransactionUnderTest;
  }
}
