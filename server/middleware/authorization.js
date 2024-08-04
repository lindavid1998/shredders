const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
	// verify JWT is valid
	// modify req object to include payload if JWT is valid

	try {
		const token = req.cookies.token;

		if (!token) {
			return res
				.status(403)
				.json({ errors: [{ msg: 'not authorized, no JWT token' }] });
		}

		// reconstruct token and check if it matches
		const payload = jwt.verify(token, process.env.JWT_KEY);

		req.user = payload;

		next();
	} catch (err) {
		res.status(403).json({ errors: [{ msg: 'not authorized, invalid JWT' }] });
	}
};
