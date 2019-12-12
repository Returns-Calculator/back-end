const express = require("express");

const Portfolios = require("../models/portfolios");
const Portfolios_Symbols = require("../models/portfolios_symbols");
const Symbols = require("../models/symbols");
const Symbols_Details = require("../models/symbols_details");
const { calculateReturns } = require("../entities/Returns");

const router = express.Router();

router.route("/symbol/:symbol").get(async (req, res) => {
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
  const result = calculateReturns(history);
  if (result.message) {
    const { message } = result;
    return res.status(404).json({ message });
  } else return res.status(200).json({ result });
});

module.exports = router;
