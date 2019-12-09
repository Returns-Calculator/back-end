const express = require("express");

const Users = require("../models/users");
const { filterUserPut } = require("../entities/User");

const router = express.Router();

router.route("/").get(async (req, res) => {
  const users = await Users.find();
  return res.status(200).json({
    users
  });
});

router
  .route("/:id")
  .put(async (req, res) => {
    const { id } = req.params;
    try {
      const changes = filterUserPut(req.body);
      if (Object.keys(changes).length === 0)
        return res.status(400).json({
          message:
            "Update request must contain at least one pertinent field (email, first_name, last_name)"
        });
      const userExists = await Users.find({ id }).first();
      if (!userExists) {
        return res.status(404).json({ message: "That user does not exist." });
      } else {
        const updated = await Users.update({ id }, changes);
        return res.status(200).json({ updated });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "There was an error while updating the user" });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;

    const deleted = await Users.remove({ id });
    if (deleted) {
      return res.status(200).json({ message: "The user has been deleted." });
    } else {
      return res.status(404).json({ message: "That user does not exist." });
    }
  })
  .get(async (req, res) => {
    const { id } = req.params;
    const user = await Users.find({ id }).first();
    if (user && user.id) {
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({ message: "That user does not exist." });
    }
  });

module.exports = router;
