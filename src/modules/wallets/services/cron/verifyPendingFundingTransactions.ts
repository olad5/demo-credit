import cron from "node-cron";
import { IWalletTransactionRepo } from "../../repos/walletTransactionRepo";
import { FundUserWalletUseCase } from "../../useCases/fundUserWallet/FundUserWalletUseCase";
import debug from "debug";

const log = debug("app:VerifyPendingWalletFundingTransactions-cron-handler");

export class VerifyPendingWalletFundingTransactions {
  private walletTransactionRepo: IWalletTransactionRepo;
  private fundUserWalletUseCase: FundUserWalletUseCase;

  constructor(
    walletTransactionRepo: IWalletTransactionRepo,
    fundUserWalletUseCase: FundUserWalletUseCase
  ) {
    this.walletTransactionRepo = walletTransactionRepo;
    this.fundUserWalletUseCase = fundUserWalletUseCase;
  }

  private async verifyPendingTransactions(): Promise<void> {
    const pendingWalletTransactions =
      await this.walletTransactionRepo.getPendingWalletFundingTransactions();

    try {
      if (pendingWalletTransactions.every((transaction) => transaction)) {
        for (const walletTransaction of pendingWalletTransactions) {
          await this.fundUserWalletUseCase.execute({
            pendingWalletTransaction: walletTransaction
          });
        }
      }
    } catch (err) {
      log(err);
    }
  }

  async run() {
    cron.schedule("*/15 * * * *", async () => {
      await this.verifyPendingTransactions();
    });
  }
}
