const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
	try {
		const user_id = req.query.user_id;

		const query = `
			SELECT users.first_name, users.last_name, users.id
			FROM users
			JOIN friends ON users.id = friends.user1_id OR users.id = friends.user2_id
			WHERE (friends.user1_id = $1 OR friends.user2_id = $1) AND users.id <> $1
			ORDER BY users.first_name ASC;
		`;

		const result = await pool.query(query, [user_id]);
		const friends = result.rows;

		res.status(200).json(friends);
	} catch (err) {
		if (typeof err === 'object') {
			console.log(err);
			res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		} else {
			res.status(500).json({ errors: [{ msg: err }] });
		}
	}
});

module.exports = router;
