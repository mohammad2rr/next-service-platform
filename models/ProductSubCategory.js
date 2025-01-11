const mongoose = require("mongoose");
require("./ProductCategory");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  productCategory: {
    type: mongoose.Types.ObjectId,
    ref: "ProductCategory",
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
});

const model =
  mongoose.models.ProductSubCategory ||
  mongoose.model("ProductSubCategory", schema);

export default model;
