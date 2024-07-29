const router = require('express').Router();
const pool = require('../db');

const doesFriendRequestExist = async (userId1, userId2) => {
	try {
		const query = `
			SELECT * FROM friend_requests
			WHERE
				(friend_requests.from_user_id = $1 AND friend_requests.to_user_id = $2)
				OR
				(friend_requests.from_user_id = $2 AND friend_requests.to_user_id = $1);
		`;

		const result = await pool.query(query, [userId1, userId2])

		const numRows = result.rowCount

		return numRows > 0
	} catch (error) {
		console.log(error)
		return False
	}
}

router.post('/add', async (req, res) => {
	try {
		const fromUserId = req.user.user_id;
		const toUserId = Number(req.query.user_id);

		if (await doesFriendRequestExist(fromUserId, toUserId)) {
			res.status(200).send('friend request already exists')
			return
		}

		const query = `
			INSERT INTO friend_requests(from_user_id, to_user_id)
			VALUES ($1, $2)
			RETURNING *;
		`;

		const result = await pool.query(query, [fromUserId, toUserId])

		const friendRequestId = result.rows[0].id

		res.status(200).json(friendRequestId)
	} catch (error) {
		if (typeof err === 'object') {
			console.log(err);
			res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		} else {
			res.status(500).json({ errors: [{ msg: error }] });
		}
	}
})

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
