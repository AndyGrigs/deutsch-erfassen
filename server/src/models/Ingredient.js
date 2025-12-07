const { Schema, model } = require('mongoose');

const ingredientSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      unique: true,
    },
    descr: {
      type: String,
      required: [true, 'Description is required'],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

const Ingredient = model('ingredient', ingredientSchema);

module.exports = { Ingredient };