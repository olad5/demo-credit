import { User } from "../domain/user";

export interface IUserRepo {
  getUserByUserId(userId: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
