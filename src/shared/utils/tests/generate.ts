import { faker } from "@faker-js/faker";
import { UserId } from "../../../modules/users/domain/userId";
import { CreditWalletBalance } from "../../../modules/wallets/domain/creditWalletBalance";
import { DebitWalletBalance } from "../../../modules/wallets/domain/debitWalletBalance";
import { Wallet } from "../../../modules/wallets/domain/wallet";
import { WalletBalance } from "../../../modules/wallets/domain/walletBalance";
import { WalletId } from "../../../modules/wallets/domain/walletId";
import { WalletTransaction } from "../../../modules/wallets/domain/walletTransaction";
import { WalletTransactionAmount } from "../../../modules/wallets/domain/walletTransactionAmount";
import { WalletTransactionNarration } from "../../../modules/wallets/domain/walletTransactionNarration";
import { WalletTransactionReference } from "../../../modules/wallets/domain/walletTransactionReference";
import { UniqueEntityID } from "../../domain/UniqueEntityID";

// passwords must have at least these kinds of characters to be valid, so we'll
// prefex all of the ones we generate with `!0_Oo` to ensure it's valid.
const getPassword = (...args) => `!0_Oo${faker.internet.password(...args)}`;
const getEmail = faker.internet.email;
const getFirstName = faker.name.firstName;
const getLastName = faker.name.lastName;
const getShortNote = faker.lorem.paragraph(1);
const getParagraph = faker.lorem.paragraph;
const getId = faker.datatype.uuid;

function signUpForm(overrides: { [key: string]: string } = {}) {
  return {
    email: getEmail(),
    password: getPassword(),
    firstName: getFirstName(),
    lastName: getLastName(),
    ...overrides
  };
}

function domainUserId(): UserId {
  const userId = UserId.create(new UniqueEntityID(getId())).getValue();
  return userId;
}

function buildUser({
  password = getPassword(),
  userId = getId(),
  ...overrides
} = {}) {
  return {
    userId,
    email: getEmail(),
    password,
    ...overrides
  };
}

function buildDomainWallet(
  userId: UserId,
  balance?: number,
  walletId?: string
): Wallet {
  const wallet = Wallet.create(
    {
      walletBalance: WalletBalance.create({
        amount: balance || 0
      }).getValue(),
      userId: userId
    },
    new UniqueEntityID(walletId || getId())
  ).getValue();

  return wallet;
}

function generateRandomAmountWithPrevAndNewBalances(amount: number): {
  amount: number;
  prevDebitWalletBalance: number;
  prevCreditWalletBalance: number;
  newDebitWalletBalance: number;
  newCreditWalletBalance: number;
} {
  if (amount < 1) {
    return undefined;
  }

  const prevDebitWalletBalance =
    amount + Math.floor(Math.random() * (100 - 30 + 1)) + 30;
  const prevCreditWalletBalance = 0;
  const newDebitWalletBalance = prevDebitWalletBalance - amount;
  const newCreditWalletBalance = prevCreditWalletBalance + amount;

  const result = {
    amount,
    prevDebitWalletBalance,
    prevCreditWalletBalance,
    newDebitWalletBalance,
    newCreditWalletBalance
  };
  return result;
}

type requestBody = {
  amount: number;
  status: "pending" | "success" | "failed";
  transactionType: "wallet_funding" | "wallet_withdrawal" | "wallet_to_wallet";
  debitWalletId: string;
  creditWalletId: string;
  prevDebitWalletBalance: number;
  prevCreditWalletBalance: number;
  newDebitWalletBalance: number;
  newCreditWalletBalance: number;
};

function buildDomainWalletTransaction(request: requestBody): WalletTransaction {
  const walletTransaction = WalletTransaction.create({
    status: request.status,
    amount: WalletTransactionAmount.create({
      amount: request.amount
    }).getValue(),
    transactionType: request.transactionType,
    ref: WalletTransactionReference.create({
      text: undefined
    }).getValue(),
    debitWalletId: WalletId.create(
      new UniqueEntityID(request.debitWalletId)
    ).getValue(),
    creditWalletId: WalletId.create(
      new UniqueEntityID(request.creditWalletId)
    ).getValue(),
    prevDebitWalletBalance: DebitWalletBalance.create({
      amount: request.prevDebitWalletBalance
    }).getValue(),
    prevCreditWalletBalance: CreditWalletBalance.create({
      amount: request.prevDebitWalletBalance
    }).getValue(),
    newDebitWalletBalance: DebitWalletBalance.create({
      amount: request.newDebitWalletBalance
    }).getValue(),
    newCreditWalletBalance: CreditWalletBalance.create({
      amount: request.newCreditWalletBalance
    }).getValue(),
    narration: WalletTransactionNarration.create({
      text: getShortNote.slice(0, 149)
    }).getValue()
  }).getValue();
  return walletTransaction;
}

export {
  signUpForm,
  domainUserId,
  buildUser,
  buildDomainWallet,
  buildDomainWalletTransaction,
  generateRandomAmountWithPrevAndNewBalances,
  getPassword as password,
  getEmail as email,
  getFirstName as firstname,
  getLastName as lastname,
  getShortNote as shortNote,
  getParagraph as paragraph,
  getId as id
};
