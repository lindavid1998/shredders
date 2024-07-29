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

		return result.rowCount > 0
	} catch (error) {
		console.log(error)
		return False
	}
}

const areFriends = async (userId1, userId2) => {
	try {
		const query = `
			SELECT * FROM friends
			WHERE
				(user1_id = $1 AND user2_id = $2)
			OR
				(user1_id = $2 AND user2_id = $1);
		`;

		const result = await pool.query(query, [userId1, userId2]);

		return result.rowCount > 0;
	} catch (error) {
		console.log(error);
		return False;
	}
};

const handleError = (err, res) => {
	if (typeof err === 'object' && err.message) {
		res.status(500).json({ errors: [{ msg: err.message }] });
	} else if (typeof err === 'object') {
		res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
	} else {
		res.status(500).json({ errors: [{ msg: err }] });
	}
};

router.post('/accept/:id', async (req, res) => {
	try {
		const fromUserId = req.user.user_id;
		const toUserId = Number(req.params.id);

		// DELETE REQUEST FROM friend_requests
		const delQuery = `
			DELETE FROM friend_requests
			WHERE
				(from_user_id = $1 AND to_user_id = $2)
				OR (from_user_id = $2 AND to_user_id = $1)
			RETURNING *;
		`;
		const result = await pool.query(delQuery, [fromUserId, toUserId])
		if (result.rowCount == 0) {
			throw new Error('friend request does not exist')
		}

		// INSERT new row INTO friends
		const addQuery = `
			INSERT INTO friends(user1_id, user2_id)
			VALUES ($1, $2)
		`
		await pool.query(addQuery, [fromUserId, toUserId])
		
		res.send(200).json('friend request accepted')
	} catch (error) {
		handleError(error, res);
	}
})

router.post('/reject/:id', async (req, res) => {
	try {
		const fromUserId = req.user.user_id;
		const toUserId = Number(req.params.id);

		const delQuery = `
			DELETE FROM friend_requests
			WHERE
				(from_user_id = $1 AND to_user_id = $2)
				OR (from_user_id = $2 AND to_user_id = $1)
			RETURNING *;
		`;
		const result = await pool.query(delQuery, [fromUserId, toUserId]);
		if (result.rowCount == 0) {
			throw new Error('friend request does not exist');
		}

		res.sendStatus(200);
	} catch (error) {
		handleError(error, res)
	}
})

router.post('/add/:id', async (req, res) => {
	try {
		const fromUserId = req.user.user_id;
		const toUserId = Number(req.params.id);

		if (await doesFriendRequestExist(fromUserId, toUserId)) {
			throw new Error('friend request already exists')
		}

		if (await areFriends(fromUserId, toUserId)) {
			throw new Error('users are already friends')
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
		handleError(error, res);
	}
})

router.get('/requests', async (req, res) => {
	try {
		// get all incoming friend requests
		const userId = req.user.user_id;
		const query = `
			SELECT friend_requests.from_user_id, users.first_name, users.last_name, users.avatar_url
			FROM friend_requests
			INNER JOIN users
				ON friend_requests.from_user_id = users.id
			WHERE friend_requests.to_user_id = $1;
		`;
		const result = await pool.query(query, [userId])
		res.status(200).json(result.rows);
	} catch (error) {
		handleError(error, res)
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
	} catch (error) {
		handleError(error, res);
	}
});

module.exports = router;
