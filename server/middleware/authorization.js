const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = async(req, res, next) => {
  // verify JWT is valid
  // modify req object to include payload if JWT is valid

  try {
    // destructure token from request header
    const jwtToken = req.header('token')

    // if no token in header
    if (!jwtToken) {
      return res.status(403).send('not authorized, no JWT token')
    }

    // reconstruct token and check if it matches
    const payload = jwt.verify(jwtToken, process.env.JWT_KEY)

    req.user = payload;

    next()
  } catch (err) {
    res.status(403).send('not authorized, invalid JWT')
  }
}