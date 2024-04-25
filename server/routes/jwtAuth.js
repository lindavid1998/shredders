const router = require('express').Router()
const pool = require('../db')
const morgan = require('morgan')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtGenerator = require('../jwtGenerator')
const { check, validationResult } = require('express-validator')

// validation middleware functions
const validateSignup = [
  check('email')
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Invalid email'),
  check('password')
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
]

const validateLogin = [
  check('email')
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Invalid email'),
  check('password').notEmpty().withMessage('Password cannot be empty'),
]

// sign up
router.get(`/signup`, (req, res) => {
  res.send('show sign up page')
})

router.post(`/signup`, validateSignup, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  const { email, password, first_name, last_name } = req.body

  try {
    const query = 'SELECT * FROM users WHERE email = $1'
    const queryResult = await pool.query(query, [email])

    if (queryResult.rows.length > 0) {
      return res.status(500).send('Email already in use')
    }

    // encrypt password
    const bcryptPw = await bcrypt.hash(password, saltRounds);

    // add user to db
    const newUser = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, bcryptPw, first_name, last_name]
    )

    // generate JWT
    const token = jwtGenerator(newUser.rows[0].user_id, first_name, last_name, email)
    res.json({ token })
  } catch (err) {
    res.status(500).send(err);
  }
})

// log in 
router.get(`/login`, (req, res) => {
  res.send('Show login page')
})

router.post(`/login`, validateLogin, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  const { email, password } = req.body

  try {
    // look up user in db
    const query = 'SELECT * FROM users WHERE email = $1'
    const queryResult = await pool.query(query, [email])

    // if no result
    if (queryResult.rows.length == 0) {
      return res.status(401).send('Email or password is wrong')
    } 

    const user = queryResult.rows[0]
    const { user_id, first_name, last_name } = user;

    // check password
    const validPw = await bcrypt.compare(password, user.password)

    if (validPw) {
      const token = jwtGenerator(user_id, first_name, last_name, email)
      res.json({ token })
    } else {
      res.status(401).send('Email or password is wrong')
    }
  } catch (err) {
    res.status(500).send(err);
  }
})

module.exports = router;