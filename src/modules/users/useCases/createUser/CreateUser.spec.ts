import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserResponse } from "./CreateUserResponse";
import { UserRepoSpy } from "../../../users/__test__/utils/testObjects/userRepoSpy";
import * as generate from "../../../../shared/utils/tests/generate";
import * as path from "path";
import { defineFeature, loadFeature } from "jest-cucumber";
import { CreateUserDTO } from "./CreateUserDTO";

const feature = loadFeature(path.join(__dirname, "./CreateUser.feature"));

defineFeature(feature, (test) => {
  let result: CreateUserResponse;

  let userRepoSpy: UserRepoSpy;
  let createUser: CreateUserUseCase;

  beforeEach(() => {
    userRepoSpy = new UserRepoSpy([]);
    createUser = new CreateUserUseCase(userRepoSpy);
  });

  test("Creating a user", ({ given, when, then }) => {
    given("I provide valid user details", () => {
      userRepoSpy = new UserRepoSpy([]);
      createUser = new CreateUserUseCase(userRepoSpy);
    });

    when("I attempt to create a user", async () => {
      result = await createUser.execute(generate.signUpForm());
    });

    then("the user should be saved successfully", () => {
      expect(result.isRight()).toEqual(true);
      expect(userRepoSpy.getTimesSaveCalled()).toEqual(1);
    });
  });

  test("Invalid password", ({ given, when, then }) => {
    given("I provide an invalid password", () => {
      userRepoSpy = new UserRepoSpy([]);
      createUser = new CreateUserUseCase(userRepoSpy);
    });

    when("I attempt to create a user", async () => {
      result = await createUser.execute({
        ...generate.signUpForm(),
        password: ""
      });
    });

    then("I should get an invalid details error", () => {
      expect(result.isRight()).toEqual(false);
      expect(userRepoSpy.getTimesSaveCalled()).toEqual(0);
    });
  });

  test("Invalid email", ({ given, when, then }) => {
    given("I provide an invalid email", () => {
      userRepoSpy = new UserRepoSpy([]);
      createUser = new CreateUserUseCase(userRepoSpy);
    });

    when("I attempt to create a user", async () => {
      result = await createUser.execute({
        ...generate.signUpForm(),
        email: "@gmail.com"
      });
    });

    then("I should get an invalid details error", () => {
      expect(result.isRight()).toEqual(false);
      expect(userRepoSpy.getTimesSaveCalled()).toEqual(0);
    });
  });

  test("Email exists", ({ given, when, then }) => {
    given("I provide an valid email", () => {
      userRepoSpy = new UserRepoSpy([]);
      createUser = new CreateUserUseCase(userRepoSpy);
    });

    when("I attempt to create a user that already exists", async () => {
      const existingAccount: CreateUserDTO = generate.signUpForm();
      const newAccount: CreateUserDTO = generate.signUpForm();
      await createUser.execute(existingAccount);
      result = await createUser.execute({
        ...newAccount,
        email: existingAccount.email
      });
    });

    then("I should get an accounts already exits error", () => {
      expect(result.isRight()).toEqual(false);
      expect(userRepoSpy.getTimesSaveCalled()).toEqual(1);
    });
  });
});
