const express = require("express");

const Portfolios_Symbols = require("../models/portfolios_symbols");
const Portfolios = require("../models/portfolios");
const Symbols = require("../models/symbols");
const {
  validatePortfolioSymbol,
  filterPortfolioSymbolPut
} = require("../entities/Portfolio_Symbol");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const portfolio_symbol = await Portfolios_Symbols.find();
    return res.status(200).json({
      portfolio_symbol
    });
  })
  .post(async (req, res) => {
    const { message, errors, success } = validatePortfolioSymbol(req.body);

    if (success) {
      const { portfolio_id, symbol_id, share_count } = req.body;

      const postBody = { portfolio_id, symbol_id, share_count };
      try {
        const exists = await Portfolios_Symbols.find(postBody).first();
        if (exists && exists.id) {
          return res.status(409).json({
            message: "That symbol is already in the portfolio provided"
          });
        } else {
          const portExists = await Portfolios.find({
            id: portfolio_id
          }).first();
          const symbolExists = await Symbols.find({ id: symbol_id }).first();
          if (portExists && symbolExists) {
            const newPortfolioSymbol = await Portfolios_Symbols.add(postBody);
            return res.status(201).json({ newPortfolioSymbol });
          } else {
            return res.status(404).json({
              message:
                "The portfolio or the symbol provided does not exist. Please double check inputs"
            });
          }
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          error:
            "There was an error while adding the portfolio symbol relationship"
        });
      }
    } else {
      return res.status(400).json({ message, errors });
    }
  });

// No put for the join table
router
  .route("/:id")
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const changes = filterPortfolioSymbolPut(req.body);
      if (Object.keys(changes).length === 0)
        return res.status(400).json({
          message: "Update request must contain share_count field"
        });
      if (typeof changes.share_count !== "number" || changes.share_count < 0)
        return res.status(400).json({
          message: "*share_count* field must be a positive decimal"
        });
      const portfolioSymbolExists = await Portfolios_Symbols.find({
        "p_s.id": id
      }).first();
      if (!portfolioSymbolExists) {
        return res.status(404).json({
          message:
            "That portfolio symbol relationship does not exist in the portfolio."
        });
      } else {
        const updated = await Portfolios_Symbols.update({ id }, changes);
        return res.status(200).json({ updated });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        error:
          "There was an error while updating the portfolio symbol relationship"
      });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    const deleted = await Portfolios_Symbols.remove({ "p_s.id": id });
    if (deleted) {
      return res
        .status(200)
        .json({ message: "The symbol has been removed from the portfolio." });
    } else {
      return res.status(404).json({
        message: "That portfolio symbol relationship does not exist."
      });
    }
  })
  .get(async (req, res) => {
    const { id } = req.params;
    const portfolio_symbol = await Portfolios_Symbols.find({
      "p_s.id": id
    }).first();
    if (portfolio_symbol && portfolio_symbol.id) {
      return res.status(200).json({ portfolio_symbol });
    } else {
      return res.status(404).json({
        message: "That portfolio symbol relationship does not exist."
      });
    }
  });

module.exports = router;
