import { User } from "../domain/user";
import { UserEmail } from "../domain/userEmail";

export interface IUserRepo {
  exists(userEmail: UserEmail): Promise<boolean>;
  getUserByUserId(userId: string): Promise<User | null>;
  save(user: User, oldEmail?: UserEmail): Promise<void>;
}
