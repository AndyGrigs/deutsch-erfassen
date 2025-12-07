const express = require('express');
const Joi = require('joi');
const { register, login, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Register route
router.post('/register', validate(registerSchema), register);

// Login route
router.post('/login', validate(loginSchema), login);

// Logout route
router.post('/logout', authenticate, logout);

module.exports = router;