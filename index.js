const express = require('express');
const app = express();

const { Sequelize } = require("sequelize");

const AuthorizationRoutes = require("./authorization/routes");
const UserRoutes = require("./users/routes");

app.use(express.json());

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./storage/data.db", // Path to the file that will store the SQLite DB.
});

// Sequelize model imports
const UserModel = require("./common/models/User");

// Initialising the Model on sequelize
UserModel.initialize(sequelize);

const port = process.env.PORT || 3000

// Syncing the models that are defined on sequelize with the tables that alredy exists
// in the database. It creates models as tables that do not exist in the DB.
sequelize
  .sync()
  .then(() => {
    console.log("Sequelize Initialised!!");

    // Attaching the Authentication and User Routes to the app.
    app.use("/", AuthorizationRoutes);
    app.use("/user", UserRoutes);

    app.listen(port, () => {
      console.log("Server Listening on PORT:", port);
    });
  })
  .catch((err) => {
    console.error("Sequelize Initialisation threw an error:", err);
  });
