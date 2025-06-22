const mongoose = require("mongoose");

const bannerProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Sản phẩm",
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      default: "Giảm 15%",
    },
    image: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      default: "Mua Ngay",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Schema mới để quản lý danh sách ID sản phẩm banner
const bannerProductIdsSchema = new mongoose.Schema(
  {
    productIds: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxProducts: {
      type: Number,
      default: 10, // Số lượng sản phẩm tối đa trong banner
    },
  },
  { timestamps: true, versionKey: false }
);

const BannerProduct = mongoose.model("BannerProduct", bannerProductSchema);
const BannerProductIds = mongoose.model("BannerProductIds", bannerProductIdsSchema);

module.exports = { BannerProduct, BannerProductIds }; 