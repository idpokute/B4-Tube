const { User } = require('../models/User');

let auth = (req, res, next) => {
  // Authentication

  // Get token from Cookie
  let token = req.cookies.x_auth;

  // get user data from Token
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;

    next();
  });
};

module.exports = { auth };
