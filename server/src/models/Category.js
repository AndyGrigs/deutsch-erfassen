const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

const Category = model('category', categorySchema);

module.exports = { Category };