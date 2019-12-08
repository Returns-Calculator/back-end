exports.seed = function(knex) {
  return knex("portfolios_symbols").insert([
    {
      portfolio_id: 1,
      symbol_id: 1
    }
  ]);
};
