exports.seed = function(knex) {
  return knex("symbols").insert([
    {
      symbol: "FPACX",
      "last refreshed": "2019-12-05T05:00:00.000Z"
    }
  ]);
};
