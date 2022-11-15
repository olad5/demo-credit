import { WalletTransactionModel } from "../../../../shared/infra/database/knex/models/WalletTransactionModel";
import { WalletTransaction } from "../../domain/walletTransaction";
import { WalletTransactionMap } from "../../mappers/walletTransactionMap";
import { IWalletTransactionRepo } from "../walletTransactionRepo";
import debug from "debug";
import { IWalletRepo } from "../walletRepo";
import { Wallet } from "../../domain/wallet";

const log = debug("app:ObjectionWalletTransactionRepo");

export class ObjectionWalletTransactionRepo implements IWalletTransactionRepo {
  private walletRepo: IWalletRepo;

  constructor(
    private walletTransactionModel: typeof WalletTransactionModel,
    walletRepo: IWalletRepo
  ) {
    this.walletTransactionModel = walletTransactionModel;
    this.walletRepo = walletRepo;
  }

  async getWalletTransactionByTransactionId(
    walletTransactionId: string
  ): Promise<WalletTransaction> {
    const objectionWalletTransaction = await this.walletTransactionModel
      .query()
      .findById(walletTransactionId);

    return WalletTransactionMap.toDomain(objectionWalletTransaction);
  }

  async getRecentsWalletTransactionByWalletId(
    wallet: Wallet
  ): Promise<WalletTransaction[]> {
    const userWalletId: string = wallet.walletId.id.toString();
    const timeTwoDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 2);
    const objectionWalletTransactions = await this.walletTransactionModel
      .query()
      .where("debit_wallet_id", userWalletId)
      .orWhere("credit_wallet_id", userWalletId)
      .where("created_at", ">=", timeTwoDaysAgo.toISOString())
      .limit(10)
      .orderBy("created_at", "asc");
    const domaineWalletTransactions = objectionWalletTransactions.map(
      (walletTransaction) => WalletTransactionMap.toDomain(walletTransaction)
    );
    return domaineWalletTransactions;
  }

  async saveWalletToWalletTransaction(
    debitWallet: Wallet,
    creditWallet: Wallet,
    walletTransaction: WalletTransaction
  ): Promise<void> {
    const objectionWalletTransaction = await WalletTransactionMap.toPersistence(
      walletTransaction
    );
    try {
      await this.walletTransactionModel.transaction(async (trx) => {
        await this.walletTransactionModel.query(trx).insert({
          ...objectionWalletTransaction
        });

        await this.walletRepo.saveBulk(creditWallet, debitWallet, trx);
      });
    } catch (err) {
      log(err);
    }
  }

  async hasPendingWalletFundingTransactionBeingInitialized(
    reference: string
  ): Promise<boolean> {
    const pendingWalletTransactionsResult = await this.walletTransactionModel
      .query()
      .where("ref", reference);

    if (pendingWalletTransactionsResult.length == 1) {
      return true;
    }
    return false;
  }

  async hasPendingWalletFundingTransactionBeenVerified(
    reference: string
  ): Promise<boolean> {
    const pendingWalletTransactionsResult = await this.walletTransactionModel
      .query()
      .where("ref", reference);

    if (pendingWalletTransactionsResult.length == 2) {
      return true;
    }
    return false;
  }

  async getPendingWalletFundingTransactions(): Promise<WalletTransaction[]> {
    const timeOneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
    const pendingWalletTransactionsResult = await this.walletTransactionModel
      .query()
      .where("status", "pending")
      .where("created_at", ">=", timeOneHourAgo.toISOString())
      .limit(10)
      .orderBy("created_at", "asc");

    const pendingWalletTransactions = pendingWalletTransactionsResult.map(
      async (transaction) => {
        const hasPendingWalletFundingTransactionBeenVerified =
          await this.hasPendingWalletFundingTransactionBeenVerified(
            transaction.ref
          );
        if (!hasPendingWalletFundingTransactionBeenVerified) {
          return WalletTransactionMap.toDomain(transaction);
        }
      }
    );
    const results = await Promise.all(pendingWalletTransactions);

    return results;
  }

  async saveWalletFundingTransaction(
    walletTransaction: WalletTransaction,
    creditWallet?: Wallet
  ): Promise<void> {
    const objectionWalletTransaction = await WalletTransactionMap.toPersistence(
      walletTransaction
    );
    const doesTransactionHavePrevRef =
      await this.hasPendingWalletFundingTransactionBeingInitialized(
        walletTransaction.ref.value
      );
    if (doesTransactionHavePrevRef === false) {
      await this.walletTransactionModel.query().insert({
        ...objectionWalletTransaction
      });
    } else {
      try {
        await this.walletTransactionModel.transaction(async (trx) => {
          await this.walletTransactionModel.query(trx).insert({
            ...objectionWalletTransaction
          });

          await this.walletRepo.save(creditWallet, trx);
        });
      } catch (err) {
        log(err);
      }
    }
  }
}
