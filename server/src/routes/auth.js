const express = require('express');
const { celebrate, Joi } = require('joi');
const { register, login, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Validation schemas
const registerSchema = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

const loginSchema = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
});

// Register route
router.post('/register', registerSchema, register);

// Login route
router.post('/login', loginSchema, login);

// Logout route
router.post('/logout', authenticate, logout);

module.exports = router;