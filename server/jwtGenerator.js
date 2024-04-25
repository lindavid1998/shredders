const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtGenerator = (uid) => {
  // create the payload 
  const payload = {
    user: uid
    // ex: name, email, other info about user
  }

  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h'})
}

module.exports = jwtGenerator