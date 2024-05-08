const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const { check, validationResult } = require('express-validator');

const validateInput = [
	check('destination_id').exists().withMessage('Destination cannot be empty'),
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

router.get('/plan', async (req, res) => {
	try {
		const query = 'SELECT * FROM destinations'
		const result = await pool.query(query);
		const destinations = result.rows
		const destinationToId = {};
		
		destinations.forEach((destination) => {
			destinationToId[destination.name] = destination.destination_id;
		});
		
		res.status(200).json(destinationToId)
	} catch (error) {
		if (typeof err === 'object') {
			res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		} else {
			res.status(500).json({ errors: [{ msg: err }] });
		}
	}
})

router.post(`/plan`, validateInput, async (req, res) => {
	// validate input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { destination_id, start_date, end_date, user_id } = req.body;

	try {
		let query = `
			INSERT INTO trips (destination_id, start_date, end_date, creator)
			VALUES ($1, $2, $3, $4) RETURNING trip_id
		`;
		// insert into db
		let result = await pool.query(query, [
			destination_id,
			start_date,
			end_date,
			user_id,
		]);
		const trip_id = result.rows[0].trip_id;

		query = `
			INSERT INTO rsvps(user_id, trip_id, status)
			VALUES ($1, $2, $3)
		`;

		result = await pool.query(query, [user_id, trip_id, 'Going']);

		res.status(200).json({ trip_id });
	} catch (err) {
		if (typeof err === 'object') {
			res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		} else {
			res.status(500).json({ errors: [{ msg: err }] });
		}
	}
});

router.get('/:id', async (req, res) => {
	// view trip
	try {
		const tripId = req.params.id;

		const query = `
			SELECT
				start_date,
				end_date,
				name AS location,
				creator,
				first_name AS creator_first_name,
				last_name AS creator_last_name
			FROM
				trips
			INNER JOIN destinations
				ON trips.destination_id = destinations.destination_id
			INNER JOIN users
				ON trips.creator = users.user_id
			WHERE
				trips.trip_id = $1
	`;

		const result = await pool.query(query, [tripId]);
		const data = result.rows[0];

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

module.exports = router;
