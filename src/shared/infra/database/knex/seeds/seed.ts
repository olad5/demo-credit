import * as bcrypt from "bcrypt";
import { nanoid } from "nanoid";

function hashPassword(): Promise<string> {
  const password = process.env.SEED_USER_PASSWORD;
  return new Promise((resolve, reject) => {
    const salt = bcrypt.genSaltSync(10);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
}
export async function seed(knex) {
  const userId1 = nanoid();
  const userId2 = nanoid();
  await knex("user").insert([
    {
      id: userId1,
      email: "dex@gmail.com",
      password: await hashPassword(),
      first_name: "dexter",
      last_name: "Mackey"
    },
    {
      id: userId2,
      email: "will@gmail.com",
      password: await hashPassword(),
      first_name: "will",
      last_name: "johnson"
    }
  ]);

  await knex("wallet").insert([
    {
      id: nanoid(),
      user_id: userId1,
      balance: 0
    },
    {
      id: nanoid(),
      user_id: userId2,
      balance: 100
    }
  ]);
}
