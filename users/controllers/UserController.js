module.exports = {
  getAllUsers: (req, res) => {
    // For some reason, knex import needs to be in here
    const knex = require('../../index');
    knex('users')
      .select('id', 'username')
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
