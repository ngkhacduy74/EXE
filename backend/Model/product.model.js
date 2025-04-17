import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 }, 
  },
  {
    timestamps: true, 
    versionKey: false,
  }
);


const Product = mongoose.model("Product", ProductSchema);

export default Product;
