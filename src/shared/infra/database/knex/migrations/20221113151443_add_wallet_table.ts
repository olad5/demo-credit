import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("wallet", (table) => {
    table.uuid("id").notNullable().unique().primary();
    table.float("balance").notNullable();
    table.uuid("user_id").references("id").inTable("user").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable("wallet");
}
