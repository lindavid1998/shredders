require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION;
const morgan = require('morgan');
const authorization = require('./middleware/authorization');
const cookieParser = require('cookie-parser');

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

// log in and sign up pages
app.use(`/${apiVersion}/auth`, authRouter);

app.use(`/${apiVersion}/trips`, authorization, tripRouter);

app.listen(port, () => {
	console.log(`server listening on port ${port}!`);
});
