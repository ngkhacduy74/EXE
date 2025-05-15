const mongoose = require("mongoose");
const { type } = require("../Validator/user.validator");
const { required } = require("joi");
const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      require: false,
    },
    fullname: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
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
      required: false,
    },
    license: { type: Boolean, require: true },
  },
  { timestamps: true, versionKey: false }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
