import { DBTransaction } from "../../../../../shared/infra/database/knex";
import { Wallet } from "../../../domain/wallet";
import { IWalletRepo } from "../../../repos/walletRepo";

export class WalletRepoSpy implements IWalletRepo {
  private wallets: Wallet[];
  private walletUnderTest: Wallet;
  private timesSaveCalled: number;
  private timesSaveBulkCalled: number;

  constructor(wallets: Wallet[]) {
    this.wallets = wallets;
    this.timesSaveCalled = 0;
    this.timesSaveBulkCalled = 0;
  }

  exists(wallet: Wallet): Promise<boolean> {
    const found = this.wallets.find((existingWallet) =>
      existingWallet.walletId.equals(wallet)
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(!!found);
      }, 300);
    });
  }
  getWalletByUserId(userId: string): Promise<Wallet> {
    const found = this.wallets.find(
      (wallet) => wallet.userId.id.toString() === userId
    );

    if (!found) {
      return undefined;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        this.walletUnderTest = found;
        resolve(found);
      }, 300);
    });
  }

  getWalletByWalletId(walletId: string): Promise<Wallet> {
    const found = this.wallets.find(
      (wallet) => wallet.walletId.id.toString() === walletId
    );

    if (!found) {
      return undefined;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        this.walletUnderTest = found;
        resolve(found);
      }, 300);
    });
  }

  getTimesSaveCalled(): number {
    return this.timesSaveCalled;
  }

  getTimesSaveBulkCalled(): number {
    return this.timesSaveBulkCalled;
  }

  getWalletUndertest(): Wallet {
    return this.walletUnderTest;
  }

  async saveBulk(
    creditWallet: Wallet,
    debitWallet: Wallet,
    trx: DBTransaction
  ): Promise<void> {
    const updatedWallets: Wallet[] = [debitWallet, creditWallet];

    this.wallets = this.wallets.filter((wallet) => {
      !updatedWallets.includes(wallet);
    });
    this.wallets.push(...updatedWallets);
    this.timesSaveBulkCalled++;
    this.walletUnderTest = undefined;
  }

  async save(wallet: Wallet): Promise<void> {
    this.wallets = this.wallets.filter((currentWallet) => {
      !currentWallet.equals(wallet);
    });
    this.wallets.push(wallet);
    this.timesSaveCalled++;
    this.walletUnderTest = wallet;
  }
}
