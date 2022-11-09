import {
  DBQueryBuilder,
  IDBClient
} from "../../../../shared/infra/database/knex/client";
import { User } from "../../domain/user";
import { BaseUser, UserMap } from "../../mappers/userMap";
import { IUserRepo } from "../userRepo";

export class KnexUserRepo implements IUserRepo {
  private BaseUserQueryBuilder: DBQueryBuilder;

  constructor(private client: IDBClient) {
    this.client = client;
    this.BaseUserQueryBuilder = this.client.instance("users");
  }

  async getUserByEmail(email: string): Promise<User> {
    const queryResult: BaseUser[] = await this.BaseUserQueryBuilder.where(
      "email",
      email
    );

    if (queryResult.length === 0) {
      return undefined;
    }
    const knexUser = queryResult[0];

    return UserMap.toDomain(knexUser);
  }

  async getUserByUserId(userId: string): Promise<User> {
    const queryResult: BaseUser[] = await this.BaseUserQueryBuilder.where(
      "id",
      userId
    );

    if (queryResult.length === 0) {
      return undefined;
    }
    const knexUser = queryResult[0];

    return UserMap.toDomain(knexUser);
  }

  async save(user: User): Promise<void> {
    const knexUser = await UserMap.toPersistence(user);

    await this.BaseUserQueryBuilder.insert({
      ...knexUser
    });
  }
}
