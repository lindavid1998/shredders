const router = require('express').Router();
const pool = require('../db');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authorization = require('../middleware/authorization');

// validation middleware functions
const validateSignup = [
	check('email')
		.notEmpty()
		.withMessage('Email cannot be empty')
		.isEmail()
		.withMessage('Invalid email'),
	check('password')
		.notEmpty()
		.withMessage('Password cannot be empty')
		.isLength({ min: 5 })
		.withMessage('Password must be at least 5 characters'),
];

const validateLogin = [
	check('email')
		.notEmpty()
		.withMessage('Email cannot be empty')
		.isEmail()
		.withMessage('Invalid email'),
	check('password').notEmpty().withMessage('Password cannot be empty'),
];

interface User {
	id: number;
	email: string;
	firstName: string;
	lastName: string;
	avatarUrl: string;
}

router.post(`/signup`, validateSignup, async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password, first_name, last_name } = req.body;

	try {
		const emailQuery = 'SELECT * FROM users WHERE email = $1';
		const emailQueryResult = await pool.query(emailQuery, [email]);

		if (emailQueryResult.rows.length > 0) {
			return res
				.status(409)
				.json({ errors: [{ msg: 'Email already in use' }] });
		}

		// encrypt password
		const bcryptPw = await bcrypt.hash(password, saltRounds);

		// add user to db
		const newUserQuery = `
			INSERT INTO users (email, password, first_name, last_name)
			VALUES ($1, $2, $3, $4)
			RETURNING id AS user_id, email, first_name, last_name, avatar_url
		`;
		const newUserQueryResult = await pool.query(newUserQuery, [
			email,
			bcryptPw,
			first_name,
			last_name,
		]);

		const data = newUserQueryResult.rows[0];

		const user: User = {
			id: data.user_id,
			firstName: data.first_name,
			lastName: data.last_name,
			email: data.email,
			avatarUrl: data.avatar_url,
		}

		const token: string = jwt.sign(user, process.env.JWT_KEY, { expiresIn: '1h'})

		res.cookie('token', token, {
			maxAge: 900000,
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		});

		res.json(user);
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

router.post(`/login`, validateLogin, async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	try {
		// look up user in db
		const query = `
			SELECT password, email, first_name, last_name, avatar_url, id AS user_id
			FROM users WHERE email = $1`;
		const queryResult = await pool.query(query, [email]);

		// if no result
		if (queryResult.rows.length == 0) {
			res.status(401).json({ errors: [{ msg: 'Incorrect email or password' }] });
			return;
		}

		const data = queryResult.rows[0];

		// check password
		const validPw = await bcrypt.compare(password, data.password);
		if (!validPw) {
			res.status(401).json({ errors: [{ msg: 'Incorrect email or password' }] });
			return;
		}

		const user: User = {
			id: data.user_id,
			firstName: data.first_name,
			lastName: data.last_name,
			email: data.email,
			avatarUrl: data.avatar_url,
		}

		const token: string = jwt.sign(user, process.env.JWT_KEY, { expiresIn: '1h'})

		res.cookie('token', token, {
			maxAge: 900000,
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		});

		res.json(user);
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

router.get('/user', authorization, (req, res) => {
	try {
		const user = req.user;
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

router.post('/logout', authorization, (req, res) => {
	try {
		res.clearCookie('token', {
			maxAge: 900000,
			httpOnly: true,
			secure: true,
			sameSite: 'None',
		});
		res.status(200).json('successfully logged out');
	} catch (err) {
		res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
	}
});

module.exports = router;
