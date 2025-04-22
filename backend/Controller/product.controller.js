const Product = require("../Model/product.model");
const mongoose = require("mongoose");
const { v1 } = require("uuid");
const createProduct = async (data) => {
  const {
    image,
    video,
    name,
    brand,
    price,
    description,
    size,
    weight,
    status,
    warranty_period,
    capacity,
    voltage,
    features,
  } = data;
  const newProduct = new Product({
    id: v1(),
    image: image,
    video: video,
    name: name,
    brand: brand,
    price: price,
    description: description,
    size: size,
    weight: weight,
    status: status,
    warranty_period: warranty_period,
    capacity: capacity,
    voltage: voltage,
    features: features,
  });
  try {
    await newProduct.save();
    return {
      success: true,
      message: "Save successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "Save unsuccessfully",
      error: err.message,
      description: "func createProduct",
    };
  }
};
const getProductById = async (id) => {
  const product = await Product.findOne({ id: id });
  if (!product) {
    return {
      success: false,
      message: "Not found product",
      description: "func getProductById",
    };
  }
  return {
    success: true,
    product,
  };
};
const updateProduct = async () => {};
const deleteProduct = async (idProduct) => {
  const exist = await Product.findOne({ id: idProduct });
  if (!exist) {
    return {
      success: false,
      message: "Not found Product",
      description: "func deleteProduct",
    };
  }
  const deleteProduct = await Product.findOneAndDelete({ id: idProduct });
  if (!deleteProduct) {
    return {
      success: false,
      message: "Delete Product unsuccessful",
      description: "func deleteProduct",
    };
  }
  return {
    success: true,
    message: "Delete Product successful",
  };
};
const loadProductStatus = async (status) => {
  const pipeline = [];
  pipeline.push({ $match: { status: status } });
  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $limit: 5 });
  const listProduct = Product.aggregate(pipeline);
  return listProduct;
};
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductStatus,
  getProductById,
};
