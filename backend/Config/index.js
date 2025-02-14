const mongoose = require("mongoose");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
module.exports.connect = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.DB_URL}`);
    console.log("Đã kết nối thành công database", process.env.DB_URL);
  } catch (err) {
    console.log("Kết nối thất bại datasbe");
  }
};
