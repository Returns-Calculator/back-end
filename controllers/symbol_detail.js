const express = require("express");

const Symbols = require("../models/symbols");
const Symbols_Details = require("../models/symbols_details");
const {
  validateSymbolDetail,
  filterSymbolDetailPut
} = require("../entities/Symbol_Detail");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const symbols_details = await Symbols_Details.find();
  return res.status(200).json({
    symbols_details
  });
});

module.exports = router;
