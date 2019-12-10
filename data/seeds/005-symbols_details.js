exports.seed = function(knex) {
  return knex("symbols_details").insert([
    {
      symbol: "FPACX",
      date: "2018-12-31",
      adjusted_close: 28.9888,
      close: "29.5300",
      dividend: "2.4100"
    },
    {
      symbol: "FPACX",
      date: "2017-12-29",
      adjusted_close: 1,
      close: 2,
      dividend: 0.89
    }
  ]);
};
