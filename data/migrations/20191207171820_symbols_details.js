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

    symbols_details.string("date");
    symbols_details.decimal("adjusted_close", null);
    symbols_details.decimal("close", null);
    symbols_details.decimal("dividend", null);

    symbols_details.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("symbols_details");
};
