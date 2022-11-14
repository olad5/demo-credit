import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("wallet_transaction", (table) => {
    table.uuid("id").notNullable().unique().primary();
    table.float("amount").notNullable();
    table.string("narration", 250).notNullable();
    table.string("ref", 150).notNullable();
    table.string("debit_wallet_id").notNullable();
    table.string("credit_wallet_id").notNullable();
    table
      .enum("transaction_type", [
        "wallet_funding",
        "wallet_withdrawal",
        "wallet_to_wallet"
      ])
      .notNullable();
    table.enum("status", ["pending", "failed", "success"]).notNullable();
    table.float("prev_credit_wallet_balance").notNullable();
    table.float("new_credit_wallet_balance").notNullable();
    table.float("prev_debit_wallet_balance").notNullable();
    table.float("new_debit_wallet_balance").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable("wallet_transaction");
}
