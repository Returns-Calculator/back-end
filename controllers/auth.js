const express = require("express");

const Users = require("../models/users");
const Portfolios = require("../models/portfolios");
const { validateUser, mapPortfolio } = require("../entities/User");

const router = express.Router();

router.route("/").post(async (req, res) => {
  const { message, errors, success } = validateUser(req.body);

  if (success) {
    const { email } = req.body;
    try {
      // Check if email of user exists in DB to decide whether to create new user
      const currentUser = await Users.find({ email }).first();
      let portfolioInfo = [];
      if (currentUser) {
        // Check if current user has any portfolios
        const userPortfolios = await Portfolios.find({
          user_id: currentUser.id
        });
        if (userPortfolios) {
          portfolioInfo = mapPortfolio(userPortfolios);
        }
        // Return user and portfolio information
        const userInfo = { currentUser, portfolioInfo };
        return res.status(200).json({ userInfo });
      } else {
        // Add user to database if email does not exist
        const newUser = await Users.add(req.body);
        const userInfo = { newUser };
        res.status(201).json({ userInfo });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        error: "There was an error while logging in"
      });
    }
  } else {
    return res.status(400).json({ message, errors });
  }
});

module.exports = router;
