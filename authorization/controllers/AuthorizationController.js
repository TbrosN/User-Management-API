const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { roles, jwtSecret, jwtExpirationInSeconds } = require("../../config");

// Generates an Access Token using username and userId for the user's authentication
const generateAccessToken = (username, userId) => {
  return jwt.sign(
    {
      userId,
      username,
    },
    jwtSecret,
    {
      expiresIn: jwtExpirationInSeconds,
    }
  );
};

// Encrypts the password using SHA256 Algorithm, for enhanced security of the password
const encryptPassword = (password) => {
  // We will hash the password using SHA256 Algorithm before storing in the DB
  // Creating SHA-256 hash object
  const hash = crypto.createHash("sha256");
  // Update the hash object with the string to be encrypted
  hash.update(password);
  // Get the encrypted value in hexadecimal format
  return hash.digest("hex");
};

module.exports = {
  register: (req, res) => {
    const knex = require("../../index");
    const payload = req.body;
    
    let encryptedPassword = encryptPassword(payload.password);
    let role = payload.role;

    if (!role) {
      role = roles.USER;
    }

    knex('users')
      .insert({username: payload.username, password: encryptedPassword, role}, 'id')
      .then((params) => {
        const id = params[0].id
        // Generating an AccessToken for the user, which will be
        // required in every subsequent request.
        const accessToken = generateAccessToken(payload.username, id);
        //get user by id
        knex('users')
          .select('id','username')
          .where('id', id)
        .then((user) => {
          return res.status(200).json({
            status: true,
            result: {
              user: user[0],
              token: accessToken
            },
          });
        })
      })
      .catch((err) => {
        return res.status(500).json({
          status: false,
          error: err,
          message: err.message
        });
      });
  },
  login: (req, res) => {
      const knex = require("../../index");
      const { username, password } = req.body;

      knex('users')
        .where('username', username)
        .then((users) => {
          const user = users[0]
          // IF user is not found with the given username
          // THEN Return user not found error
          if (!user) {
            return res.status(400).json({
              status: false,
              error: {
                message: `Could not find any user with username: \`${username}\`.`,
              },
            });
          }

        const encryptedPassword = encryptPassword(password);

        // IF Provided password does not match with the one stored in the DB
        // THEN Return password mismatch error
        if (user.password !== encryptedPassword) {
          return res.status(400).json({
            status: false,
            error: {
              message: `Provided username and password did not match.`,
            },
          });
        }

        // Generating an AccessToken for the user, which will be
        // required in every subsequent request.
        const accessToken = generateAccessToken(user.username, user.id);

        return res.status(200).json({
          status: true,
          data: {
            user: user,
            token: accessToken,
          },
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          status: false,
          error_msg: err.message,
        });
      });
  }
}