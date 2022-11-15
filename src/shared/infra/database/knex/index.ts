import knex from "knex";
import Objection, { Model } from "objection";
import knexConfig from "./knexfile";

export type DBTransaction = Objection.Transaction;

Model.knex(knex(knexConfig["development"]));

export class BaseModel extends Model {
  static get modelPaths() {
    return ["../models/"];
  }
}
