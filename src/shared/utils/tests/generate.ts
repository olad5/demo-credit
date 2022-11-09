import { faker } from "@faker-js/faker";

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

export {
  signUpForm,
  getPassword as password,
  getEmail as email,
  getFirstName as firstname,
  getLastName as lastname,
  getShortNote as shortNote,
  getParagraph as paragraph,
  getId as id
};
