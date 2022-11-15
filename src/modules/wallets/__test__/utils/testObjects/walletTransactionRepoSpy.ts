import { DBTransaction } from "../../../../../shared/infra/database/knex";
import { Wallet } from "../../../domain/wallet";
import { WalletTransaction } from "../../../domain/walletTransaction";
import { IWalletRepo } from "../../../repos/walletRepo";
import { IWalletTransactionRepo } from "../../../repos/walletTransactionRepo";

export class WalletTransactionRepoSpy implements IWalletTransactionRepo {
  private walletTransactions: WalletTransaction[];
  private walletTransactionUnderTest: WalletTransaction;
  private walletRepo: IWalletRepo;
  private timesWalletFundingSaveCalled: number;
  private timesWalletToWalletSaveCalled: number;

  constructor(
    walletTransactions: WalletTransaction[],
    walletRepo: IWalletRepo
  ) {
    this.walletTransactions = walletTransactions;
    this.walletRepo = walletRepo;
    this.timesWalletFundingSaveCalled = 0;
    this.timesWalletToWalletSaveCalled = 0;
  }

  async hasPreviousReference(
    walletTransaction: WalletTransaction
  ): Promise<boolean> {
    let result: boolean;
    const trxs = this.walletTransactions.filter((trx) =>
      trx.ref.equals(walletTransaction.ref)
    );

    if (trxs.length == 2) {
      result = true;
    } else {
      result = false;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(result);
      }, 300);
    });
  }

  async saveWalletFundingTransaction(
    walletTransaction: WalletTransaction,
    creditWallet?: Wallet
  ): Promise<void> {
    let trx: DBTransaction;

    const hasTransactionBeenVerified = await this.hasPreviousReference(
      walletTransaction
    );
    if (!hasTransactionBeenVerified) {
      this.walletRepo.save(creditWallet, trx);
    }
    this.walletTransactions.push(walletTransaction);
    this.timesWalletFundingSaveCalled++;
    this.walletTransactionUnderTest = walletTransaction;
  }

  async saveWalletToWalletTransaction(
    debitWallet: Wallet,
    creditWallet: Wallet,
    walletTransaction: WalletTransaction
  ): Promise<void> {
    let trx: DBTransaction;
    this.walletTransactions.push(walletTransaction);
    this.walletRepo.saveBulk(creditWallet, debitWallet, trx);
    this.timesWalletToWalletSaveCalled++;
    this.walletTransactionUnderTest = walletTransaction;
  }

  getPendingWalletFundingTransactions(): Promise<WalletTransaction[]> {
    const found = this.walletTransactions.filter(
      (walletTransaction) => walletTransaction.status === "pending"
    );

    if (!found) {
      return undefined;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(found);
      }, 300);
    });
  }

  getTransactionsByReference(reference: string): Promise<WalletTransaction[]> {
    const found = this.walletTransactions.filter(
      (walletTransaction) => walletTransaction.ref.value === reference
    );

    if (!found) {
      return undefined;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(found);
      }, 300);
    });
  }

  getWalletTransactionByTransactionId(
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

  getTimesWalletToWalletSaveCalled(): number {
    return this.timesWalletToWalletSaveCalled;
  }
  getWalletTransactionUndertest(): WalletTransaction {
    return this.walletTransactionUnderTest;
  }
}
