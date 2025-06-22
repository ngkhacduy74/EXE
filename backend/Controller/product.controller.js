const Product = require("../Model/product.model");
const mongoose = require("mongoose");
const { v1 } = require("uuid");
const stripHtmlTags = (str) => str.replace(/<[^>]*>?/gm, "").trim();
const createProduct = async (data, user) => {
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
    business_phone,
    capacity,
    voltage,
    features,
    quantity,
  } = data;
  const newProduct = new Product({
    id: v1(),
    image: image,
    video: video,
    name: name,
    brand: brand,
    price: price,
    description: stripHtmlTags(description),
    size: size,
    weight: weight,
    status: status,
    // business_phone: business_phone,
    warranty_period: warranty_period,
    capacity: capacity,
    voltage: voltage,
    features: features,
    creator: {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
    },
    quantity: quantity,
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
const updateProduct = async (id, data) => {
  const product = await Product.findOneAndUpdate(
    { id: id },
    {
      $set: data,
    },
    {
      new: true,
    }
  );
  if (!product) {
    return {
      success: false,
      message: "Can not update Product",
      description: "func updateProduct",
    };
  }
  return {
    success: true,
    message: "Update Product successful",
    data: product,
  };
};
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
const loadAllProduct = async () => {
  const pipeline = [];
  pipeline.push({ $match: {} });
  pipeline.push({ $sort: { createdAt: -1 } });
  const product = await Product.aggregate(pipeline);
  if (!product) {
    return {
      success: false,
      data: null,
      message: "Not found Product",
      description: "func loadAllProduct",
    };
  }
  return { success: true, data: product };
};
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductStatus,
  getProductById,
  loadAllProduct,
};
