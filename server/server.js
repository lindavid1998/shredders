require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION;
const morgan = require('morgan');
const authorization = require('./middleware/authorization');
const cookieParser = require('cookie-parser');
const pool = require('./db');

// import routers
const authRouter = require('./routes/jwtAuth');
const tripRouter = require('./routes/trips');

// MIDDLEWARE

app.use(express.json()); // enables req.body

app.use(cookieParser());

const corsOptions = {
	origin: 'http://localhost:5000', // client's origin
	credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

// ROUTES

// home page
app.get(`/${apiVersion}`, authorization, async (req, res) => {
	const userId = req.query.userId;

	try {
		const query = `
			SELECT
				rsvps.trip_id,
				rsvps.status,
				trips.start_date,
				trips.end_date,
				destinations.name AS location
			FROM
				rsvps
			INNER JOIN trips
				ON rsvps.trip_id = trips.trip_id
			INNER JOIN destinations
				ON trips.destination_id = destinations.destination_id
			WHERE
				rsvps.user_id = $1
			ORDER BY trips.start_date; 
		`;

		const result = await pool.query(query, [userId]);

		// [
		// 	{
		// 		trip_id: 51,
		// 		status: 'Going',
		// 		start_date: 2024-05-01T07:00:00.000Z,
		// 		end_date: 2024-05-04T07:00:00.000Z,
		// 		location: 'Mammoth'
		// 	},
		// 	{
		// 		trip_id: 52,
		// 		status: 'Not going',
		// 		start_date: 2024-05-02T07:00:00.000Z,
		// 		end_date: 2024-05-03T07:00:00.000Z,
		// 		location: 'Bear Mountain'
		// 	}
		// ]
		res.status(200).json(result.rows)
	} catch (err) {
		if (typeof err === 'object') {
			res.status(500).json({ errors: [{ msg: 'Internal server error' }] });
		} else {
			res.status(500).json({ errors: [{ msg: err }] });
		}
	}
});

// log in and sign up pages
app.use(`/${apiVersion}/auth`, authRouter);

app.use(`/${apiVersion}/trips`, authorization, tripRouter);

app.listen(port, () => {
	console.log(`server listening on port ${port}!`);
});
