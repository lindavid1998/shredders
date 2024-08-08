const router = require('express').Router();
const pool = require('../db');
const { handleError } = require('../utils');

router.get('/', async (req, res) => {
	try {
		const user_id = req.user.user_id;

		const query = `
      SELECT DISTINCT
        u.id AS user_id,
        u.avatar_url,
        CONCAT(u.first_name, ' ', u.last_name) AS full_name,
        CASE 
          WHEN f.id IS NOT NULL THEN 2
        WHEN fr.id IS NOT NULL THEN 1
          ELSE 0 
        END AS status
      FROM 
        users u
      LEFT JOIN 
        friends f 
      ON 
        u.id = f.user1_id OR u.id = f.user2_id
      LEFT JOIN 
        friend_requests fr
      ON 
        u.id = fr.from_user_id OR u.id = fr.to_user_id
      WHERE
        NOT u.id = $1
      ORDER BY
        status, full_name;
    `;
    // status: 0 -> not friends, 1 -> pending, 2 -> friends

		const result = await pool.query(query, [user_id]);
		const friends = result.rows;

		res.status(200).json(friends);
	} catch (error) {
		handleError(error, res);
	}
});

module.exports = router;
