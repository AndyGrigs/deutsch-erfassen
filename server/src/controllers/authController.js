const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../models/User');
const { signToken } = require('../helpers/generateToken');
const HttpError = require('../helpers/HttpError');
const { sendEmail } = require('../helpers/sendEmail');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashPassword,
      name: name || email.split('@')[0], // Use email prefix as name if not provided
    });

    const token = signToken(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await User.updateToken(newUser.id, token);

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = signToken(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await User.updateToken(user.id, token);

    res.json({
      status: 'success',
      code: 200,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { id } = req.user;

    await User.deleteToken(id);

    res.status(204).json({
      status: 'success',
      code: 204,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
};