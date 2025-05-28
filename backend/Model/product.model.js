const mongoose = require("mongoose");

const Other_features = new mongoose.Schema({
  id: { type: String, require: true },
  title: { type: String, require: true },
  description: { type: String, require: true },
});

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, require: true },
    image: [{ type: String, require: true }],
    video: [{ type: String, require: true }],
    name: { type: String, require: true },
    brand: { type: String, require: true },
    price: { type: String, require: true },
    description: { type: String, require: true },
    size: { type: String, require: true },
    weight: { type: Number, require: true },
    status: { type: String, require: true, enum: ["New", "SecondHand"] },
    warranty_period: { type: Number, require: true },
    capacity: { type: Number, require: true },
    voltage: { type: String, require: true },
    features: [{ type: Other_features, require: false }],
    quantity: { type: Number, require: true, min: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
