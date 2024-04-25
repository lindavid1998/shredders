const router = require('express').Router()
const pool = require('../db')
const morgan = require('morgan')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtGenerator = require('../jwtGenerator')

// sign up
router.get(`/signup`, (req, res) => {
  res.send('show sign up page')
})

router.post(`/signup`, async (req, res) => {
  const { email, password, first_name, last_name } = req.body

  try {
    const query = 'SELECT * FROM users WHERE email = $1'
    const user = await pool.query(query, [email])

    if (user.rows.length > 0) {
      res.status(500).send('Email already in use')
    }

    // encrypt password
    const bcryptPw = await bcrypt.hash(password, saltRounds);

    // add user to db
    const newUser = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, bcryptPw, first_name, last_name]
    )
    
    // {
    //   user_id: 6,
    //   password: '$2b$10$nusldjeMXlYFkXSbnC4izOI0d5JOaIxNWVVKRRc6akB8o6SRVDv/y',
    //   email: 'test2@email.com',
    //   first_name: 'foo',
    //   last_name: 'bar'
    // }

    // generate JWT
    const token = jwtGenerator(newUser.rows[0]['user_id'])
    res.json({ token })
  } catch (err) {
    res.status(500).send(err);
  }
})

// log in 
router.get(`/login`, (req, res) => {
  res.send('Show login page')
})

router.post(`/login`, async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)

  try {
    // encrypt password
    const bcryptPw = await bcrypt.hash(password, saltRounds);
    console.log(bcryptPw)

    // look up user in db
    const query = 'SELECT * FROM users WHERE email = $1'
    const user = await pool.query(query, [email])

    // if no result
    if (user.rows.length == 0) {
      res.status(401).send('Email or password is wrong')
    } 

    // check password
    const validPw = await bcrypt.compare(password, user.rows[0].password)

    if (validPw) {
      const token = jwtGenerator(user.rows[0]['user_id'])
      res.json({ token })
    } else {
      res.status(401).send('Email or password is wrong')
    }
  } catch (err) {
    res.status(500).send(err);
  }
})

module.exports = router;