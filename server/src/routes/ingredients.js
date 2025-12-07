const express = require('express');
const { getIngredients } = require('../controllers/ingredientController');

const router = express.Router();

router.get('/', getIngredients);

module.exports = router;