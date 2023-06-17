module.exports = {
  has: (role) => {
    return (req, res, next) => {
      const knex = require('../../index');
      const {
        user: { userId },
      } = req;

      knex('users')
        .where('id', userId)
        .then((users) => {
          const user = users[0]
          // IF user does not exist in our database, means something is fishy
          // THEN we will return forbidden error and ask user to login again
          if (!user) {
            return res.status(403).json({
              status: false,
              error: "Invalid access token provided, please login again.",
            });
          }

          const userRole = user.role;

          // IF user does not possess the required role
          // THEN return forbidden error
          if (userRole !== role) {
            return res.status(403).json({
              status: false,
              error: `You need to be a ${role} to access this endpoint.`,
            });
          }

          next();
        });
    };
  },
};
