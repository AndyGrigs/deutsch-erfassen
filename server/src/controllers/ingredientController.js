const { Ingredient } = require('../models/Ingredient');
const HttpError = require('../helpers/HttpError');

const getIngredients = async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({});
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        ingredients,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIngredients,
};