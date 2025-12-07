const { Testimonial } = require('../models/Testimonial');
const HttpError = require('../helpers/HttpError');

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({});
    
    res.json({
      status: 'success',
      code: 200,
      data: {
        testimonials,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
};