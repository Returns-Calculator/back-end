exports.seed = function(knex) {
  return knex("portfolios").insert([
    {
      user_id: 1,
      name: "test portfolio"
    }
  ]);
};
