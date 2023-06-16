const { ValidationErrorItem } = require("sequelize");
const UserModel = require("./../../common/models/User");

module.exports = {
  getAllUsers: (req, res) => {
    UserModel.findAllUsers({})
      .then((users) => {
        return res.status(200).json({
          status: true,
          data: users,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
        });
      });
  }
}
