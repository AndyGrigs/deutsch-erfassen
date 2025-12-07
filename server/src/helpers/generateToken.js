const jwt = require('jsonwebtoken');

const signToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  signToken,
  verifyToken
};