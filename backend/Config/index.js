const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
module.exports.connect = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.DB_URL}`);
  } catch (err) {
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
