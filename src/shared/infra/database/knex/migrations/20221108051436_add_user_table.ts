import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("user", (table) => {
    table.uuid("id").notNullable().unique().primary();
    table.string("email", 250).notNullable().unique();
    table.string("password", 250).notNullable();
    table.string("first_name", 150).notNullable();
    table.string("last_name", 150).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable("user");
}
