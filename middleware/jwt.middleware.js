const jwt = require("jsonwebtoken")

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.TOKEN_SECRET); // the verify method decodes/validates the token and returns the payload
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json("token not provided or not valid");
  }
}

  module.exports = {isAuthenticated}