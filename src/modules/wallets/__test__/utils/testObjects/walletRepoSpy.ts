import { Wallet } from "../../../domain/wallet";
import { IWalletRepo } from "../../../repos/walletRepo";

export class WalletRepoSpy implements IWalletRepo {
  private wallets: Wallet[];
  private walletUnderTest: Wallet;
  private timesWriteCalled: number;
  private timesUpdateCalled: number;

  constructor(wallets: Wallet[]) {
    this.wallets = wallets;
    this.timesWriteCalled = 0;
    this.timesUpdateCalled = 0;
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

  getTimesWriteCalled(): number {
    return this.timesWriteCalled;
  }

  getTimesUpdateCalled(): number {
    return this.timesUpdateCalled;
  }

  getWalletUndertest(): Wallet {
    return this.walletUnderTest;
  }

  async update(wallet: Wallet): Promise<void> {
    this.wallets.push(wallet);
    this.timesUpdateCalled++;
    this.walletUnderTest = wallet;
  }

  async save(wallet: Wallet): Promise<void> {
    this.wallets.push(wallet);
    this.timesWriteCalled++;
    this.walletUnderTest = wallet;
  }
}
