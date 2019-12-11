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

router
  .route("/")
  .get(async (req, res) => {
    const symbols_details = await Symbols_Details.find();
    return res.status(200).json({
      symbols_details
    });
  })
  .post(async (req, res) => {
    const { message, errors, success } = validateSymbolDetail(req.body);

    if (success) {
      const { symbol, date, adjusted_close, close, dividend } = req.body;
      try {
        const exists = await Symbols_Details.find({ symbol, date }).first();
        if (exists && exists.id) {
          return res
            .status(409)
            .json({
              message:
                "Symbol detail for that date already exists in database, please use put endpoint if you wish to update"
            });
        } else {
          const newSymbolDetail = await Symbols_Details.add({
            symbol: symbol.toUpperCase(),
            date,
            adjusted_close,
            close,
            dividend
          });
          return res.status(201).json({ newSymbolDetail });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          error: "There was an error while adding the symbol"
        });
      }
    } else {
      return res.status(400).json({ message, errors });
    }
  });

router
  .route("/:symbol")
  .get(async (req, res) => {
    const { symbol } = req.params;
    const symbols_details = await Symbols_Details.find({
      symbol: symbol.toUpperCase()
    });
    return res.status(200).json({
      symbols_details
    });
  })
  // Posting with response from AlphaVantage
  .post(async (req, res) => {
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
    // DB operations
    let addedDetails = [];
    if (addArray.length > 0) {
      addedDetails = await Symbols_Details.addMany(addArray);
    }
    let updatedDetails = [];
    for (const i of updateArray) {
      updatedDetails.push(
        await Symbols_Details.update({ symbol: i.symbol, date: i.date }, i)
      );
    }

    // return activity summary
    return res.status(200).json({ addedDetails, updatedDetails, notUpdated });
  });

router
  .route("/:id")
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const changes = filterSymbolDetailPut(req.body);
      if (Object.keys(changes).length === 0)
        return res.status(400).json({
          message:
            "Update request must contain at least one pertinent field (adjusted_close, close, or dividend)"
        });
      const symbolDetailExists = await Symbols_Details.find({ id }).first();
      if (!symbolDetailExists) {
        return res
          .status(404)
          .json({ message: "That symbol detail record does not exist." });
      } else {
        const updated = await Symbols_Details.update({ id }, changes);
        return res.status(200).json({ updated });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "There was an error while updating the symbol detail" });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    const deleted = await Symbols_Details.remove({ id });
    if (deleted) {
      return res
        .status(200)
        .json({ message: "The symbol detail has been deleted." });
    } else {
      return res
        .status(404)
        .json({ message: "That symbol detail record does not exist." });
    }
  })
  .get(async (req, res) => {
    const { id } = req.params;
    const symbol = await Symbols_Details.find({ id }).first();
    if (symbol && symbol.id) {
      return res.status(200).json({ symbol });
    } else {
      return res
        .status(404)
        .json({ message: "That symbol detail record does not exist." });
    }
  });

module.exports = router;
