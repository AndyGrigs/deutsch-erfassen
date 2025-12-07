const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../models/User');
const { signToken } = require('../helpers/generateToken');
const HttpError = require('../helpers/HttpError');
const { sendEmail } = require('../helpers/sendEmail');

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, 'Email in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashPassword,
    });

    const token = signToken(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await User.findByIdAndUpdate(newUser._id, { token });

    res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
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

    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, 'Email or password is wrong');
    }

    const token = signToken(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      status: 'success',
      code: 200,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, { token: null });

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