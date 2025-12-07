const { Category } = require('../models/Category');
const HttpError = require('../helpers/HttpError');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
};