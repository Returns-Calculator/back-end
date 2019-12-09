exports.up = function(knex) {
  return knex.schema.createTable("symbols_details", symbols_details => {
    symbols_details.increments();

    symbols_details
      .string("symbol")
      .notNullable()
      .references("symbol")
      .inTable("symbols")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    symbols_details.string("date").notNullable();
    symbols_details.decimal("adjusted_close", null).notNullable();
    symbols_details.decimal("close", null).notNullable();
    symbols_details.decimal("dividend", null).notNullable();

    symbols_details.timestamps(true, true);

    symbols_details.unique(["symbol", "date"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("symbols_details");
};
