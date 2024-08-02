const router = require('express').Router();
const pool = require('../db');
const { handleError } = require('../utils');

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

router.post('/accept/:id', async (req, res) => {
	try {
		const id = req.params.id;

		// DELETE REQUEST FROM friend_requests
		const delQuery = `
			DELETE FROM friend_requests
			WHERE id = $1
			RETURNING *;
		`;
		const result = await pool.query(delQuery, [id])
		if (result.rowCount == 0) {
			throw new Error('friend request does not exist')
		}
		const data = result.rows[0]

		// INSERT new row INTO friends
		const addQuery = `
			INSERT INTO friends(user1_id, user2_id)
			VALUES ($1, $2)
		`
		await pool.query(addQuery, [data.from_user_id, data.to_user_id])
		
		res.sendStatus(200)
	} catch (error) {
		handleError(error, res);
	}
})

router.post('/reject/:id', async (req, res) => {
	try {
		const id = req.params.id;

		const delQuery = `
			DELETE FROM friend_requests
			WHERE id = $1
			RETURNING *;
		`;
		const result = await pool.query(delQuery, [id]);
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
			SELECT friend_requests.id, friend_requests.from_user_id, users.first_name, users.last_name, users.avatar_url
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
		const user_id = req.user.user_id;

		const query = `
			SELECT users.first_name, users.last_name, users.id, CONCAT(users.first_name, ' ', users.last_name) AS full_name
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
