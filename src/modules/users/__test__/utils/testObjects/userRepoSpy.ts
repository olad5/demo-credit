import { User } from "../../../domain/user";
import { IUserRepo } from "../../../repos/userRepo";

export class UserRepoSpy implements IUserRepo {
  private users: User[];
  private timesSaveCalled: number;

  constructor(users: User[]) {
    this.users = users;
    this.timesSaveCalled = 0;
  }

  getUserByEmail(email: string): Promise<User> {
    const found = this.users.find((u) => u.email.value === email);

    if (!found) {
      return null;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(found);
      }, 300);
    });
  }
  getUserByUserId(userId: string): Promise<any> {
    const found = this.users.find((u) => u.userId.id.toString() === userId);

    if (!found) {
      return null;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(found);
      }, 300);
    });
  }

  getTimesSaveCalled(): number {
    return this.timesSaveCalled;
  }

  async save(user: User): Promise<any> {
    this.users.push(user);
    this.timesSaveCalled++;
  }
}
