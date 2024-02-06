const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("./../middleware/jwt.middleware.js"); // <== IMPORT


router.get("/", (req, res, next) => {
  res.json("All good in auth");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  const salt = bcrypt.genSaltSync(13);
  const hashedPassword = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.status(400).json({ message: "Provide username, password" });
    return;
  }

  // Regex implementation for future use of email //
  // Use regex to validate the email format
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  // if (!emailRegex.test(email)) {
  //   res.status(400).json({ message: 'Provide a valid email address.' });
  //   return;
  // }

  // Use regex to validate the password format
  // const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!passwordRegex.test(password)) {
  //   res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
  //   return;
  // }

  // Check the users collection if a user with the same email already exists
  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }
  } catch (error) {
    // Handle any errors that occur during the async/await operations
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }

  try {
    const newUser = await User.create({
      ...req.body,
      passwordHash: hashedPassword,
    });
    console.log(newUser);
    res.status(201).json({ message: "New user created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // Check if email or password are provided as empty string
  if (username === "" || password === "") {
    res.status(400).json({ message: "Provide username and password." });
    return;
  }

  // Check if there is a user with the same email
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, user.passwordHash);
    if (passwordCorrect) {
      // Deconstruct the user object to omit the password
      const { _id, username } = user;
      const expirationTime = 21600

      // Create an object that will be set as the token payload
      const payload = { _id, username , expirationTime };
      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: "HS256",
        expiresIn: expirationTime,
      });
      return res.status(200).json({ authToken: authToken });
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
  });



router.get("/verify", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id);
    res.status(200).json({...req.payload, favourites: user.favourites});
  } catch (error) {
    console.log(error);
  }  
});

module.exports = router;
