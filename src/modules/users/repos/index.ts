import { UserModel } from "../../../shared/infra/database/knex/models/UserModel";
import { ObjectionUserRepo } from "./implementations/ObjectionUserRepo";

const userRepo = new ObjectionUserRepo(UserModel);

export { userRepo };
