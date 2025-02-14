const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      require: true,
    },
    fullname: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    username: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    ava_img_url: {
      type: String,
      require: true,
    },
    is_active: {
      type: String,
      require: true,
    },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
