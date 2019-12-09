exports.up = function(knex) {
  return knex.schema.createTable("symbols", symbols => {
    symbols.increments();

    symbols
      .string("symbol")
      .notNullable()
      .unique();

    symbols.date("last_refreshed");
    symbols.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("symbols");
};
