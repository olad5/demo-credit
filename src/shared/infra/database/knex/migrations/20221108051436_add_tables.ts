import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema
    .createTable("users", (table) => {
      table.uuid("id").notNullable().unique().primary();
      table.string("email", 250).notNullable().unique();
      table.string("password", 250).notNullable();
      table.string("first_name", 150).notNullable();
      table.string("last_name", 150).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("wallet", (table) => {
      table.uuid("id").notNullable().unique().primary();
      table.float("balance").notNullable();
      table
        .string("user_id", 250)
        .references("id")
        .inTable("users")
        .notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    })
    .createTable("wallet_transactions", (table) => {
      table.uuid("id").notNullable().unique().primary();
      table.float("amount").notNullable();
      table.string("narration", 250).notNullable();
      table.string("ref", 150).notNullable();
      table
        .string("debit_wallet_id", 250)
        .references("id")
        .inTable("wallet")
        .notNullable();
      table
        .string("credit_wallet_id", 250)
        .references("id")
        .inTable("wallet")
        .notNullable();
      table
        .enu("transaction_type", [
          "wallet_funding",
          "wallet_withdrawal",
          "wallet_to_wallet"
        ])
        .notNullable();
      table.enu("status", ["pending", "failed", "success"]).notNullable();
      table.float("prev_credit_wallet_balance").notNullable();
      table.float("new_credit_wallet_balance").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema
    .dropTable("users")
    .dropTable("wallet")
    .dropTable("wallet_transactions");
}
