import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }, // Prevents negative stock
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    versionKey: false,
  }
);

// Create a Mongoose model
const Product = mongoose.model("Product", ProductSchema);

export default Product;
