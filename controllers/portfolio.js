const express = require("express");

const Users = require("../models/users");
const Portfolios = require("../models/portfolios");
const {
  validatePortfolio,
  filterPortfolioPut
} = require("../entities/Portfolio");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const portfolios = await Portfolios.find();
  return res.status(200).json({
    portfolios
  });
});

// Get portfolio by user, add new portfolios (must belong to a user)
router
  .route("/users/:user_id")
  .get(async (req, res) => {
    const { user_id } = req.params;
    // check existence of user and retrieve portfolios
    const user = await Users.find({ id: user_id }).first();
    const portfolios = await Portfolios.find({ user_id });

    try {
      if (user && user.id) {
        return res.status(200).json({ portfolios });
      } else {
        return res.status(404).json({ message: "That user does not exist." });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "There was an error while updating the user" });
    }
  })
  .post(async (req, res) => {
    const { user_id } = req.params;
    const validator = { ...req.body, user_id };
    const { message, errors, success } = validatePortfolio(validator);

    if (success) {
      const { name } = req.body;
      try {
        const user = await Users.find({ id: user_id }).first();

        if (user && user.id) {
          const newPortfolio = await Portfolios.add({ user_id, name });
          return res.status(201).json({ newPortfolio });
        } else {
          return res.status(404).json({ message: "That user does not exist." });
        }
      } catch (err) {
        console.log(err);
        res.status(500).json({
          error: "There was an error while adding the portfolio"
        });
      }
    } else {
      return res.status(400).json({ message, errors });
    }
  });

// get, update and delete goes here
router
  .route("/:id")
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const changes = filterPortfolioPut(req.body);
      if (Object.keys(changes).length === 0)
        return res.status(400).json({
          message: "Update request must contain name field"
        });
      const portfolioExists = await Portfolios.find({ id }).first();
      if (!portfolioExists) {
        return res
          .status(404)
          .json({ message: "That portfolio does not exist." });
      } else {
        const updated = await Portfolios.update({ id }, changes);
        return res.status(200).json({ updated });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "There was an error while updating the portfolio" });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    const deleted = await Portfolios.remove({ id });
    if (deleted) {
      return res
        .status(200)
        .json({ message: "The portfolio has been deleted." });
    } else {
      return res
        .status(404)
        .json({ message: "That portfolio does not exist." });
    }
  })
  .get(async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolios.find({ id }).first();
    if (portfolio && portfolio.id) {
      return res.status(200).json({ portfolio });
    } else {
      return res
        .status(404)
        .json({ message: "That portfolio does not exist." });
    }
  });

module.exports = router;
