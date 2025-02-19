const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v1 } = require("uuid");
const User = require("../Model/user.model");

async function Login(params) {
  const user = await User.findOne({ email: params.email });
  if (!user) {
    throw new Error("Tài khoản không tồn tại!");
  }
  const checkPassword = await bcrypt.compare(params.password, user.password);
  if (!checkPassword) {
    throw new Error("Mật khẩu không chính xác");
  }
  const token = jwt.sign(
    {
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "30m",
    }
  );

  return { success: true, message: "Đăng nhập thành công", token };
}

async function Register(params) {
  const checkEmail = await User.findOne({ email: params.email });
  if (checkEmail) {
    return { success: false, message: "Email đã được đăng kí" };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(params.password, salt);
  const newUser = new User({
    id: v1(),
    fullname: params.fullname,
    phone: params.phone,
    address: params.address,
    password: hashedPassword,
    email: params.email,
    gender: params.gender,
    role: "User",
    ava_img_url: params.ava_img_url,
    is_active: true,
  });
  try {
    await newUser.save();
  } catch (error) {
    return { success: false, message: "Đăng kí thất bại", newUser };
  }

  return { success: true, message: "Đăng kí thành công", newUser };
}
async function getAllUser() {
  //thiếu phân trang
  const getUser = await User.find();
  return getUser;
}
module.exports = {
  Login,
  Register,
};
