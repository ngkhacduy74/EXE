const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
module.exports.connect = async () => {
  if (!process.env.DB_URL) {
    const msg = 'Missing required environment variable DB_URL';
    console.error('❌', msg);
    throw new Error(msg);
  }
  try {
    const conn = await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Đã kết nối thành công database", process.env.DB_URL);
    return conn;
  } catch (err) {
    console.error("❌ Kết nối thất bại database:", err.message || err);
    throw err;
  }
};
module.exports.configCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY_CLOUD,
    api_secret: process.env.API_SECRET,
  });
};

module.exports.cloudinary = cloudinary;
