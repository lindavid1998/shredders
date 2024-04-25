require('dotenv').config()
const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const apiVersion = process.env.API_VERSION;
const pool = require('./db')
const morgan = require('morgan')

// import routers
const authRouter = require('./routes/jwtAuth')

// MIDDLEWARE

app.use(express.json())  // enables req.body
app.use(cors())

// ROUTES 

// app.get(`/`, (req, res) => {
//   res.send('Show landing page')
// })

// log in and sign up pages
app.use(`/${apiVersion}/auth`, authRouter)

// home page 
app.get(`/${apiVersion}/home`, (req, res) => {
  res.send('Show home page after user logged in')
})

// app.get(`/${apiVersion}/trips/plan`, (req, res) => {
//   res.send('plan a trip') 
// })

// app.post(`/${apiVersion}/trips/plan`, (req, res) => {
//   res.send('save new trip')
//   // INSERT INTO trips (destination_id, start_date, end_date) values (2, (DATE '2024-01-03'), (DATE '2024-01-05'));
// });

// app.get(`/${apiVersion}/trips/:id`, async (req, res) => {
//   // view trip 
//   try {
//     const tripId = req.params.id
//     const query = 'SELECT * FROM trips WHERE trip_id = $1';
//     const result = await pool.query(query, [tripId]);
//     const data = result.rows[0]

//     res.json({
//       status: 'OK',
//       data
//     });
//   } catch (err) {
//     res.status(500).send(err)
//   }
// })

app.listen(port, () => {
  console.log(`server listening on port ${port}!`);
});