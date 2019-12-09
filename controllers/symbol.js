// id, symbol, last refreshed, created_at, updated_at

const express = require("express");

const Symbols = require("../models/symbols");
const { validateSymbol, filterSymbolPut } = require("../entities/Symbol");

const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    const symbols = await Symbols.find();
    return res.status(200).json({
      symbols
    });
  })
  .post(async (req, res) => {
    const { message, errors, success } = validateSymbol(req.body);

    if (success) {
      const { symbol, last_refreshed } = req.body;
      try {
        const exists = await Symbols.find({ symbol }).first();
        if (exists && exists.id) {
          return res
            .status(409)
            .json({ message: "Symbol already exists in database" });
        } else {
          const newSymbol = await Symbols.add({ symbol, last_refreshed });
          return res.status(201).json({ newSymbol });
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

// Fuzzy search needed?
router.route("/:symbol").get(async (req, res) => {
  const { symbol } = req.params;
  const search = await Symbols.find({ symbol: symbol.toUpperCase() }).first();
  if (search && search.id) {
    return res.status(200).json({ search });
  } else {
    return res
      .status(404)
      .json({ message: "That symbol does not exist in the database." });
  }
});

router
  .route("/:id")
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const changes = filterSymbolPut(req.body);
      if (Object.keys(changes).length === 0)
        return res.status(400).json({
          message: "Update request must contain last_refreshed field"
        });
      const symbolExists = await Symbols.find({ id }).first();
      if (!symbolExists) {
        return res.status(404).json({ message: "That symbol does not exist." });
      } else {
        const updated = await Symbols.update({ id }, changes);
        return res.status(200).json({ updated });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "There was an error while updating the symbol" });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    const deleted = await Symbols.remove({ id });
    if (deleted) {
      return res.status(200).json({ message: "The symbol has been deleted." });
    } else {
      return res.status(404).json({ message: "That symbol does not exist." });
    }
  })
  .get(async (req, res) => {
    const { id } = req.params;
    const symbol = await Symbols.find({ id }).first();
    if (symbol && symbol.id) {
      return res.status(200).json({ symbol });
    } else {
      return res.status(404).json({ message: "That symbol does not exist." });
    }
  });

module.exports = router;
