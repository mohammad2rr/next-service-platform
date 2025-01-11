const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  img: {
    type: String,
    required: false,
  },
});

const model =
  mongoose.models.ProductCategory || mongoose.model("ProductCategory", schema);

export default model;
