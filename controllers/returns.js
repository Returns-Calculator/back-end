const express = require("express");

const Portfolios = require("../models/portfolios");
const Portfolios_Symbols = require("../models/portfolios_symbols");
const Symbols = require("../models/symbols");
const Symbols_Details = require("../models/symbols_details");
const { calculateReturns, getLastMonth } = require("../entities/Returns");

const router = express.Router();

router.route("/symbol/:symbol").get(async (req, res) => {
  // Data from latest month end, so need last month
  const [lastMonth, lastMonthYear] = getLastMonth();

  const { symbol } = req.params;
  const symbolExists = await Symbols.find({
    symbol: symbol.toUpperCase()
  }).first();
  if (!symbolExists) {
    return res.status(404).json({
      message: "The symbol provided does not exist."
    });
  }
  const history = await Symbols_Details.find({ symbol: symbol.toUpperCase() });
  if (!history) {
    return res.status(404).json({
      message: "There is no price history detail for this symbol."
    });
  }
  const result = calculateReturns(history, lastMonth, lastMonthYear);
  if (result.message) {
    const { message } = result;
    return res.status(404).json({ message });
  } else return res.status(200).json({ result });
});

router.route("/portfolio/:id").get(async (req, res) => {
  // Data from latest month end, so need last month
  const [lastMonth, lastMonthYear] = getLastMonth();

  const { id } = req.params;
  const portfolioExists = await Portfolios.find({ id }).first();
  if (!portfolioExists) {
    return res.status(404).json({
      message: "The portfolio provided does not exist."
    });
  }
  const portfolioHoldings = await Portfolios_Symbols.find({
    "p_s.portfolio_id": id
  });
  const holdingSymbols = portfolioHoldings.map(holding => holding.symbol);
  const portfolioHistory = await Symbols_Details.find({
    many_symbols: holdingSymbols
  });
  return res.status(200).json({ portfolioHistory });
});

module.exports = router;
