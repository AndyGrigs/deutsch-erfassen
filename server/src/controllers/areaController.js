const { Area } = require('../models/Area');
const HttpError = require('../helpers/HttpError');

const getAreas = async (req, res, next) => {
  try {
    const areas = await Area.find({});
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        areas,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAreas,
};