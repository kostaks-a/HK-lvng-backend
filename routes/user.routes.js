const router = require("express").Router();
const { json } = require("express");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Recipe = require("../models/Recipe.model");
const User = require("../models/User.model");

// Get profile info
router.get("/profile/:username", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("favourites")
      .populate("creations");
    console.log(user)
    res.status(200).json({ username: user.username, favourites: user.favourites, creations: user.creations });
  } catch (error) {
    console.log(error);
  }
});



// Delete user
router.delete("/:id/delete", isAuthenticated, async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message : 'user deleted successfully'});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
