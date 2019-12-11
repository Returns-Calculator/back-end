const express = require("express");

const Symbols = require("../models/symbols");
const Symbols_Details = require("../models/symbols_details");
const {
  validateSymbolDetail,
  filterSymbolDetailPut,
  parseDetails,
  getTodayDate
} = require("../entities/Symbol_Detail");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const symbols_details = await Symbols_Details.find();
  return res.status(200).json({
    symbols_details
  });
});

// Posting with response from AlphaVantage
router.route("/:symbol").post(async (req, res) => {
  const { symbol } = req.params;
  // Check that symbol exists, add if not
  const symbolExists = await Symbols.find({ symbol }).first();
  const last_refreshed = getTodayDate()[0];
  // if symbol exists, update last_refreshed, if not, add symbol
  if (symbolExists) {
    const update = await Symbols.update({ symbol }, { last_refreshed });
    console.log("Symbol updated", update);
  }
  if (!symbolExists) {
    // Helper to get today's date in YYYY-MM-DD format
    const add = await Symbols.add({
      symbol: symbol.toUpperCase(),
      last_refreshed
    });
    console.log("Symbol added:", add);
  }
  // Check shape of body conforms to AlphaVantage json
  if (!req.body["Meta Data"] || !req.body["Monthly Adjusted Time Series"])
    return res.status(400).json({
      message:
        "This endpoint is for Alpha Vantage monthly series json objects only, please conform to the shape of AV responses"
    });
  // Check that symbol passed in params matches body
  if (req.body["Meta Data"]["2. Symbol"] !== symbol.toUpperCase())
    return res.status(400).json({
      message:
        "The symbol provided in the body does not match the symbol from params, please double check inputs"
    });
  // Get symbol price history from req.body, get current records for symbol
  const alphaVantageHistory = req.body;
  const databaseHistory = await Symbols_Details.find({ symbol });
  // Helper to separate records that need to be added from recs that need to be updated
  const [addArray, updateArray, notUpdated] = parseDetails(
    alphaVantageHistory,
    databaseHistory
  );
  console.log(addArray, updateArray, notUpdated);
  // DB operations
  let addedDetails = [];
  if (addArray.length > 0)
    addedDetails = await Symbols_Details.addMany(addArray);
  let updatedDetails = [];
  for (const i of updateArray) {
    updatedDetails.push(
      await Symbols_Details.update({ symbol: i.symbol, date: i.date }, i)
    );
  }

  // return activity summary
  return res.status(200).json({ addedDetails, updatedDetails, notUpdated });
});

module.exports = router;
