import debug from "debug";
import { UniqueEntityID } from "../../../shared/domain/UniqueEntityID";
import { Mapper } from "../../../shared/infra/Mapper";
import { User } from "../domain/user";
import { UserEmail } from "../domain/userEmail";
import { UserFirstName } from "../domain/userFirstName";
import { UserLastName } from "../domain/userLastName";
import { UserPassword } from "../domain/userPassword";

export type BaseUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
};

const log = debug("app:UserMap");

export class UserMap implements Mapper<User> {
  public static toDomain(knexModel: BaseUser): User | null {
    const userFirstNameOrError = UserFirstName.create({
      name: knexModel.first_name
    });
    const userLastNameOrError = UserLastName.create({
      name: knexModel.last_name
    });
    const userPasswordOrError = UserPassword.create({
      value: knexModel.password,
      hashed: true
    });

    const userEmailOrError = UserEmail.create(knexModel.email);
    const userOrError = User.create(
      {
        firstname: userFirstNameOrError.getValue(),
        lastname: userLastNameOrError.getValue(),
        password: userPasswordOrError.getValue(),
        email: userEmailOrError.getValue()
      },
      new UniqueEntityID(knexModel.id)
    );

    userOrError.isFailure ? log(userOrError.getErrorValue()) : "";

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(user: User): Promise<BaseUser> {
    let password = "";
    if (!!user.password === true) {
      if (user.password.isAlreadyHashed()) {
        password = user.password.value;
      } else {
        password = await user.password.getHashedValue();
      }
    }

    const baseUser: BaseUser = {
      id: user.userId.id.toString(),
      email: user.email.value,
      first_name: user.firstname.value,
      last_name: user.lastname.value,
      password: password
    };

    return baseUser;
  }
}
