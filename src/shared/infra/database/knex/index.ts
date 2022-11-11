import knex from "knex";
import { Model } from "objection";
import knexConfig from "./knexfile";

Model.knex(knex(knexConfig["development"]));

export class BaseModel extends Model {
  static get modelPaths() {
    return ["../models/"];
  }
}
