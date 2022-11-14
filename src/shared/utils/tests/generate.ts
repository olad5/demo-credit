import { faker } from "@faker-js/faker";
import { UserId } from "../../../modules/users/domain/userId";
import { Wallet } from "../../../modules/wallets/domain/wallet";
import { WalletBalance } from "../../../modules/wallets/domain/walletBalance";
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

function buildDomainWallet(userId: UserId): Wallet {
  const wallet = Wallet.create(
    {
      walletBalance: WalletBalance.create({
        amount: 0
      }).getValue(),
      userId: userId
    },
    new UniqueEntityID(getId())
  ).getValue();

  return wallet;
}

export {
  signUpForm,
  domainUserId,
  buildUser,
  buildDomainWallet,
  getPassword as password,
  getEmail as email,
  getFirstName as firstname,
  getLastName as lastname,
  getShortNote as shortNote,
  getParagraph as paragraph,
  getId as id
};
