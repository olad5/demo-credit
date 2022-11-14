import debug from "debug";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { WalletTransactionModelType } from "../../../shared/infra/database/knex/models/WalletTransactionModel";
import { Mapper } from "../../../shared/infra/Mapper";
import { CreditWalletBalance } from "../domain/creditWalletBalance";
import { DebitWalletBalance } from "../domain/debitWalletBalance";
import { WalletId } from "../domain/walletId";
import { WalletTransaction } from "../domain/walletTransaction";
import { WalletTransactionAmount } from "../domain/walletTransactionAmount";
import { WalletTransactionNarration } from "../domain/walletTransactionNarration";
import { WalletTransactionReference } from "../domain/walletTransactionReference";
import { WalletTransactionDTO } from "../dtos/walletTransactionDTO";

const log = debug("app:WalletTransactionMap");

export class WalletTransactionMap implements Mapper<WalletTransaction> {
  public static toDTO(
    walletTransaction: WalletTransaction
  ): WalletTransactionDTO {
    return {
      id: walletTransaction.walletTransactionId.id.toString(),
      amount: walletTransaction.amount.value,
      ref: walletTransaction.ref.value,
      status: walletTransaction.status,
      transactionType: walletTransaction.transactionType,
      narration: walletTransaction.narration.value,
      debitWalletId: walletTransaction.debitWalletId.id.toString(),
      creditWalletId: walletTransaction.creditWalletId.id.toString()
    };
  }
  public static toDomain(
    knexModel: WalletTransactionModelType
  ): WalletTransaction | undefined {
    const walletTransactionOrError = WalletTransaction.create(
      {
        amount: WalletTransactionAmount.create({
          amount: knexModel.amount
        }).getValue(),
        status: knexModel.status,
        transactionType: knexModel.transaction_type,
        narration: WalletTransactionNarration.create({
          text: knexModel.narration
        }).getValue(),
        ref: WalletTransactionReference.create({
          text: knexModel.ref
        }).getValue(),
        debitWalletId: WalletId.create(
          new UniqueEntityID(knexModel.debit_wallet_id)
        ).getValue(),
        creditWalletId: WalletId.create(
          new UniqueEntityID(knexModel.credit_wallet_id)
        ).getValue(),
        prevDebitWalletBalance: DebitWalletBalance.create({
          amount: knexModel.prev_debit_wallet_balance
        }).getValue(),
        newDebitWalletBalance: DebitWalletBalance.create({
          amount: knexModel.new_debit_wallet_balance
        }).getValue(),
        prevCreditWalletBalance: CreditWalletBalance.create({
          amount: knexModel.prev_credit_wallet_balance
        }).getValue(),
        newCreditWalletBalance: CreditWalletBalance.create({
          amount: knexModel.new_credit_wallet_balance
        }).getValue()
      },

      new UniqueEntityID(knexModel.id)
    );

    walletTransactionOrError.isFailure
      ? log(walletTransactionOrError.getErrorValue())
      : "";

    return walletTransactionOrError.isSuccess
      ? walletTransactionOrError.getValue()
      : null;
  }

  public static async toPersistence(
    walletTransaction: WalletTransaction
  ): Promise<WalletTransactionModelType> {
    const objectionWalletTransaction: WalletTransactionModelType = {
      id: walletTransaction.walletTransactionId.id.toString(),
      amount: walletTransaction.amount.value,
      narration: walletTransaction.narration.value,
      ref: walletTransaction.ref.value,
      status: walletTransaction.status,
      prev_debit_wallet_balance: walletTransaction.prevDebitWalletBalance.value,
      prev_credit_wallet_balance:
        walletTransaction.prevCreditWalletBalance.value,
      new_debit_wallet_balance: walletTransaction.newDebitWalletBalance.value,
      new_credit_wallet_balance: walletTransaction.newCreditWalletBalance.value,
      transaction_type: walletTransaction.transactionType,
      debit_wallet_id: walletTransaction.debitWalletId.id.toString(),
      credit_wallet_id: walletTransaction.creditWalletId.id.toString()
    };

    return objectionWalletTransaction;
  }
}
