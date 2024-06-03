const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
	try {
		const user_id = req.query.user_id;

		const query = `
			SELECT u.first_name, u.last_name, u.user_id
			FROM users u
			JOIN friends f ON u.user_id = f.user1_id OR u.user_id = f.user2_id
			WHERE (f.user1_id = $1 OR f.user2_id = $1) AND u.user_id <> $1
			ORDER BY u.first_name ASC;
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
