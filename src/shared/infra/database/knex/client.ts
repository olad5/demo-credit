import knex, { Knex } from "knex";
import knexConfig from "./knexfile";

const DBClient = {
  instance: knex(knexConfig["development"])
};

export type IDBClient = typeof DBClient;
export type DBQueryBuilder = Knex.QueryBuilder;

Object.freeze(DBClient);

export default DBClient;
