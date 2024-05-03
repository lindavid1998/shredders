const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { check, validationResult } = require('express-validator');

const validateInput = [
	check('start_date')
		.notEmpty()
		.withMessage('Start date cannot be empty')
		.trim()
		.custom((start, { req }) => {
			const startDate = new Date(start);
			const endDate = new Date(req.body.end_date);

			if (startDate > endDate) {
				throw new Error('End date cannot be earlier than start date');
			}
			return true;
		}),
	check('end_date').notEmpty().withMessage('End date cannot be empty'),
];

router.post(`/plan`, authorization, validateInput, async (req, res) => {
	// validate input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { destination_id, start_date, end_date, user_id } = req.body;

	try {
		// insert into db
		await pool.query(
			'INSERT INTO trips (destination_id, start_date, end_date, creator) values ($1, $2, $3, $4)',
			[destination_id, start_date, end_date, user_id]
		);

		res.status(200).json('success');
	} catch (err) {
		if (typeof err === 'object') {
			res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		} else {
			res.status(500).json({ errors: [{ msg: err }] });
		}
	}
});

module.exports = router;
