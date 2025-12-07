const { Schema, model } = require('mongoose');

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
    },
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
    },
    ingredients: [
      {
        id: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        measure: {
          type: String,
          required: true,
        },
      },
    ],
    time: {
      type: Number,
      required: [true, 'Time is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    thumb: {
      type: String,
      required: [true, 'Thumb is required'],
    },
    video: {
      type: String,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Recipe = model('recipe', recipeSchema);

module.exports = { Recipe };