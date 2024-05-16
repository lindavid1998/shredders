const router = require('express').Router();
const pool = require('../db');

router.get('/', async (req, res) => {
	try {
		const user_id = req.query.user_id;

		const query = `
			SELECT u.first_name, u.last_name
			FROM users u
			JOIN friends f ON u.user_id = f.user1_id OR u.user_id = f.user2_id
			WHERE (f.user1_id = $1 OR f.user2_id = $1) AND u.user_id <> $1
			LIMIT 3;
		`;

		let result = await pool.query(query, [user_id]);
		let friends = result.rows;

		result = [];

		friends.forEach((friend) =>
			result.push(`${friend.first_name} ${friend.last_name}`)
		);

		console.log(result)

		res.status(200).json(result);
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
