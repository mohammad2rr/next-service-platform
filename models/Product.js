const mongoose = require("mongoose");
require("./ProductSubCategory");
require("./Comment");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 5,
  },
  tags: {
    type: [String],
    required: true,
  },
  img: {
    type: String, // img src
    required: true,
  },
  comments: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  subCategory: {
    type: mongoose.Types.ObjectId,
    ref: "ProductSubCategory",
    required: true,
  },
});

const model = mongoose.models.Product || mongoose.model("Product", schema);

export default model;
