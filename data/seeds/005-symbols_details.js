exports.seed = function(knex) {
  return knex("symbols_details").insert([
    {
      symbol: "FPACX",
      date: "2018-12-31",
      adjusted_close: 28.9888,
      close: 29.53,
      dividend: 2.41
    },
    {
      symbol: "FPACX",
      date: "2017-12-29",
      adjusted_close: 31.3151,
      close: 34.69,
      dividend: 0.89
    }
  ]);
};
