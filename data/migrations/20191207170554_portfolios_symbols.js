exports.up = function(knex) {
  return knex.schema.createTable("portfolios_symbols", portfolios_symbols => {
    portfolios_symbols.increments();

    portfolios_symbols
      .integer("portfolio_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("portfolios")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    portfolios_symbols
      .integer("symbol_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("symbols")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    portfolios_symbols
      .decimal("share_count", 10, 2)
      .notNullable()
      .defaultTo(0);
    portfolios_symbols.timestamps(true, true);

    portfolios_symbols.unique(["portfolio_id", "symbol_id"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("portfolios_symbols");
};
