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
const path = require('path');

// import routers
const authRouter = require('./routes/auth.ts');
const tripRouter = require('./routes/trips');
const friendsRouter = require('./routes/friends');
const usersRouter = require('./routes/users');
const avatarRouter = require('./routes/avatar.ts');

// MIDDLEWARE

app.use(express.json()); // enables req.body

app.use(cookieParser());

const corsOptions = {
	origin: process.env.CORS_ORIGIN,
	credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// ROUTES

// log in and sign up pages
app.use(`/${apiVersion}/auth`, authRouter);

app.use(`/${apiVersion}/trips`, authorization, tripRouter);

app.use(`/${apiVersion}/friends`, authorization, friendsRouter);

app.use(`/${apiVersion}/users`, authorization, usersRouter);

app.use(`/${apiVersion}/avatar`, authorization, avatarRouter);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.listen(port, () => {
	console.log(`server listening on port ${port}!`);
});
