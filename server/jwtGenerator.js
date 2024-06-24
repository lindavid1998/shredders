const jwt = require('jsonwebtoken');
require('dotenv').config()

const jwtGenerator = (user_id, first_name, last_name, email, avatar_url) => {
  // create the payload 
  const payload = {
    user_id,
    first_name,
    last_name,
    email,
    avatar_url
  }

  return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '1h'})
}

module.exports = jwtGenerator