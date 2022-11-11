import { UserModelType } from "../../../../shared/infra/database/knex/models/UserModel";
import { User } from "../../domain/user";
import { UserMap } from "../../mappers/userMap";
import { IUserRepo } from "../userRepo";

export class ObjectionUserRepo implements IUserRepo {
  constructor(private userModel: UserModelType) {
    this.userModel = userModel;
  }

  async getUserByEmail(email: string): Promise<User> {
    const queryResult = await this.userModel.query().where("email", email);
    if (queryResult.length === 0) {
      return undefined;
    }
    const objectionUser = queryResult[0];

    return UserMap.toDomain(objectionUser);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const queryResult = await this.userModel
      .query()
      .select()
      .where("id", userId);

    if (queryResult.length === 0) {
      return undefined;
    }
    const objectionUser = queryResult[0];

    return UserMap.toDomain(objectionUser);
  }

  async save(user: User): Promise<void> {
    const objectionUser = await UserMap.toPersistence(user);

    await this.userModel.query().insert({
      ...objectionUser
    });
  }
}
