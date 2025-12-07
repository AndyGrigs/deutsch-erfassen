const { Schema, model } = require('mongoose');

const testimonialSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    avatar: {
      type: String,
      required: [true, 'Avatar is required'],
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

const Testimonial = model('testimonial', testimonialSchema);

module.exports = { Testimonial };