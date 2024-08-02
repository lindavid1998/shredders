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
const friendsRouter = require('./routes/friends');
const usersRouter = require('./routes/users')

// MIDDLEWARE

app.use(express.json()); // enables req.body

app.use(cookieParser());

const corsOptions = {
	origin: 'http://localhost:5100', // client's origin
	credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

// ROUTES

// log in and sign up pages
app.use(`/${apiVersion}/auth`, authRouter);

app.use(`/${apiVersion}/trips`, authorization, tripRouter);

app.use(`/${apiVersion}/friends`, authorization, friendsRouter);

app.use(`/${apiVersion}/users`, authorization, usersRouter);

app.listen(port, () => {
	console.log(`server listening on port ${port}!`);
});
