const express = require("express");

const Users = require("../models/users");
const Portfolios = require("../models/portfolios");

const router = express.Router();

router.route("/").post(async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({
      error: `Error during ${req.method} at ${req.originalUrl}: email is required.`
    });
  }
  // Check if email of user exists to decide whether to create new user
  const currentUser = await Users.find({ email: req.body.email }).first();
  if (currentUser) {
    // Check if current user has any portfolios
    const userPortfolios = await Portfolios.find({ user_id: currentUser.id });
    let portfolioInfo = [];
    if (userPortfolios) {
      // If user has portfolios, map portfolio info to conform names to front end component structure
      portfolioInfo = userPortfolios.map(port => {
        const { id, name, created_at, updated_at } = port;
        return {
          id,
          name,
          created_at,
          updated_at
        };
      });
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
});

module.exports = router;
