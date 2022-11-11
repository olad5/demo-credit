import { BaseModel } from "..";
import { dispatchEvents } from "../../../../domain/events/eventsDispatcher";

export class UserModel extends BaseModel {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;

  static async afterInsert({ asFindQuery }) {
    const userCreated: {
      id: string;
    }[] = await asFindQuery().select("id");
    const userId = userCreated[0].id;
    dispatchEvents(userId);
  }

  static get tableName(): string {
    return "users";
  }
  static get idColumn(): string {
    return "id";
  }
}

export type UserModelType = typeof UserModel;
