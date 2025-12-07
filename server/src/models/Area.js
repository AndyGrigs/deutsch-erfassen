const { Schema, model } = require('mongoose');

const areaSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Area = model('area', areaSchema);

module.exports = { Area };