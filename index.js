const express = require('express');
const app = express();

const AuthorizationRoutes = require("./authorization/routes");
const UserRoutes = require("./users/routes");

app.use(express.json());

const knexConfig = require('./db/knexfile');
//initialize knex
const knex = require('knex')(knexConfig[process.env.NODE_ENV])
// export knex
module.exports = knex

const port = process.env.PORT || 3000
const ip = process.env.MY_IP || 'localhost'

// Attaching the Authentication and User Routes to the app.
app.use("/", AuthorizationRoutes);
app.use("/user", UserRoutes);

// Endpoint for debugging testing
app.get('/test', (req, res) => {
  res.status(200).json({test: true});
});

app.listen(port, ip, () => {
  console.log("Server Listening on PORT:", port);
});
