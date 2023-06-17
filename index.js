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

// Attaching the Authentication and User Routes to the app.
app.use("/", AuthorizationRoutes);
app.use("/user", UserRoutes);

// Debugging testing
app.get('/test', (req, res) => {
  knex('users')
    .select('*')
    .then((users) => {
      return res.json(users);
    })
    .catch((err) => {
      console.error(err);
      return res.json({success: false, message: 'An error occurred, please try again later.'});
    })
});

app.listen(port, () => {
  console.log("Server Listening on PORT:", port);
});
