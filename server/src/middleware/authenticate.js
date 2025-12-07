const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const { authorization = '' } = req.headers;
    const token = authorization.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized'
      });
    }

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(id);

      if (!user || !user.token) {
        return res.status(401).json({
          message: 'Not authorized'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.message === 'jwt expired') {
        return res.status(401).json({
          message: 'Token expired'
        });
      }
      return res.status(401).json({
        message: 'Not authorized'
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

module.exports = authenticate;