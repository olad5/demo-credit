import { KnexUserRepo } from "./implementations/knexUserRepo";
import DBClient from "../../../shared/infra/database/knex/client";

const userRepo = new KnexUserRepo(DBClient);

export { userRepo };
