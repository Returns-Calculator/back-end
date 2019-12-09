exports.up = function(knex) {
  return knex.schema.createTable("portfolios", portfolios => {
    portfolios.increments();

    portfolios
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    portfolios.string("name", 255).notNullable();
    portfolios.timestamps(true, true);

    portfolios.unique(["user_id", "name"]);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists("portfolios");
};
