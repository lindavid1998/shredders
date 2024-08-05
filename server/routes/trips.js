const router = require('express').Router();
const pool = require('../db');
const { check, validationResult } = require('express-validator');
const { handleError } = require('../utils');

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

router.get('/destinations', async (req, res) => {
	try {
		const query = 'SELECT * FROM destinations';
		const result = await pool.query(query);
		const destinations = result.rows;
		const destinationToId = {};

		destinations.forEach((destination) => {
			destinationToId[destination.name] = destination.id;
		});

		res.status(200).json(destinationToId);
	} catch (err) {
		handleError(err, res);
	}
});

router.post(`/create`, validateInput, async (req, res) => {
	// validate input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { destination_id, start_date, end_date, addedFriends } = req.body;

	const user_id = req.user.user_id;

	try {
		// insert trip into trips table
		let query = `
			INSERT INTO trips (destination_id, start_date, end_date, creator_id)
			VALUES ($1, $2, $3, $4) RETURNING id
		`;

		let result = await pool.query(query, [
			destination_id,
			start_date,
			end_date,
			user_id,
		]);

		// get the id of the trip created
		const trip_id = result.rows[0].id;

		// add creator to rsvp table
		query = `
			INSERT INTO rsvps(user_id, trip_id, status)
			VALUES ($1, $2, $3)
		`;

		result = await pool.query(query, [user_id, trip_id, 'Going']);

		// add invited friends to rsvp table
		if (addedFriends) {
			await Promise.all(
				addedFriends.map((friend) => {
					return pool.query(query, [friend.id, trip_id, 'Tentative']);
				})
			);
		}

		res.status(200).json({ trip_id });
	} catch (err) {
		handleError(err, res);
	}
});

router.get(`/overview`, async (req, res) => {
	const user = req.user;
	const userId = user.user_id;

	try {
		const query = `
			SELECT
					trips.id,
					trips.start_date,
					trips.end_date,
					destinations.name,
					destinations.image_large_url,
					destinations.image_small_url,
					COALESCE(
							json_agg(
									json_build_object(
											'user_id', rsvps.user_id,
											'avatar_url', users.avatar_url,
											'status', rsvps.status
									)
							), 
							'[]'
					) AS rsvps
			FROM
					trips
			JOIN
					rsvps ON trips.id = rsvps.trip_id
			JOIN
					destinations ON destinations.id = trips.destination_id 
			JOIN
					users ON users.id = rsvps.user_id
			WHERE
					trips.id IN (
							SELECT trip_id
							FROM rsvps
							WHERE user_id = $1
					)
			GROUP BY
					trips.id, destinations.name, destinations.image_large_url, destinations.image_small_url;
		`;

		const result = await pool.query(query, [userId]);

		res.status(200).json(result.rows);
	} catch (err) {
		handleError(err, res);
	}
});

router.post('/:id/invite', async (req, res) => {
	const tripId = req.params.id;
	const invitedUserIds = req.body.invited_users;

	try {
		await Promise.all(
			invitedUserIds.map((userId) => {
				return pool.query(
					'INSERT INTO rsvps (user_id, trip_id) VALUES ($1, $2)',
					[userId, tripId]
				);
			})
		);

		const rsvpQuery = `
			SELECT
				r.id,
				r.user_id,
				r.status,
				u.first_name,
				u.last_name,
				u.avatar_url
			FROM
				rsvps r
			JOIN
				users u
			ON
				r.user_id = u.id
			WHERE
				r.trip_id = $1;
		`;

		const updatedRsvps = await pool.query(rsvpQuery, [tripId]);

		res.status(200).json({
			rsvps: updatedRsvps.rows,
		});
	} catch (error) {
		handleError(error, res);
	}
});

// delete comment
router.delete('/:id/comments/:comment_id', async (req, res) => {
	try {
		const commentId = req.params.comment_id;

		let query = `
			SELECT user_id FROM comments where id = $1
		`;
		let result = await pool.query(query, [commentId]);

		// throw error if comment doesn't exist
		if (result.rows.length == 0) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'comment does not exist' }] });
		}

		// throw error if user doesn't match
		const userId = result.rows[0]['user_id'];
		if (userId != req.user.user_id) {
			return res.status(400).json({
				errors: [{ msg: 'only the owner of the comment can delete' }],
			});
		}

		// delete the comment
		query = `
			DELETE FROM comments
			WHERE id = $1
		`;

		result = await pool.query(query, [commentId]);
		res.status(200).json('successfully removed comment');
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

// post comment
router.post('/:id/comments', async (req, res) => {
	try {
		const tripId = req.params.id;
		const userId = req.user.user_id;
		const { body } = req.body;

		const query = `
			INSERT INTO comments(body, user_id, trip_id)
			VALUES($1, $2, $3)
			RETURNING * 
		`;

		const result = await pool.query(query, [body, userId, tripId]);

		res.status(200).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

// view trip
router.get('/:id', async (req, res) => {
	try {
		const tripId = req.params.id;

		const tripQuery = `
			SELECT
				start_date,
				end_date,
				name AS location,
				creator_id,
				first_name AS creator_first_name,
				last_name AS creator_last_name,
				destinations.image_large_url,
				destinations.image_small_url
			FROM
				trips
			INNER JOIN destinations
				ON trips.destination_id = destinations.id
			INNER JOIN users
				ON trips.creator_id = users.id
			WHERE
				trips.id = $1
		`;

		const rsvpsQuery = `
			SELECT
				r.id,
				r.user_id,
				r.status,
				u.first_name,
				u.last_name,
				u.avatar_url
			FROM
				rsvps r
			JOIN
				users u
			ON
				r.user_id = u.id
			WHERE
				r.trip_id = $1;
		`;

		const commentsQuery = `
			SELECT
				c.id,
				c.body,
				c.user_id,
				c.created_at,
				u.first_name,
				u.last_name,
				u.avatar_url
			FROM
				comments c
			JOIN
				users u
			ON
				c.user_id = u.id
			WHERE
				c.trip_id = $1
			ORDER BY c.created_at;
		`;

		const tripResult = await pool.query(tripQuery, [tripId]);
		const rsvpResult = await pool.query(rsvpsQuery, [tripId]);
		const commentsResult = await pool.query(commentsQuery, [tripId]);

		res.status(200).json({
			...tripResult.rows[0],
			rsvps: rsvpResult.rows,
			comments: commentsResult.rows,
		});
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const tripId = req.params.id;

		let query = `SELECT creator_id FROM trips WHERE id = $1;`;
		let result = await pool.query(query, [tripId]);

		// throw error if trip doesn't exist
		if (result.rows.length == 0) {
			return res.status(400).json({ errors: [{ msg: 'trip does not exist' }] });
		}

		const creatorId = result.rows[0]['creator_id'];
		const userId = req.user.user_id;

		// throw error if current user doesn't match creator
		if (userId != creatorId) {
			return res
				.status(400)
				.json({ errors: [{ msg: 'only the owner of the trip can delete' }] });
		}

		// delete the trip
		query = `
			DELETE FROM trips
			WHERE id = $1
		`;

		result = await pool.query(query, [tripId]);
		res.status(200).json('successfully removed trip');
	} catch (err) {
		res.status(500).json({ errors: [{ msg: err }] });
	}
});

module.exports = router;
