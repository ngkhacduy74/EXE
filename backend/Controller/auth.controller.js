const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v1 } = require("uuid");
const User = require("../Model/user.model");
const { sendOTP, verifyOTP } = require("./otp.controller");

async function getUserByEmail(params) {
  console.log("áouida8dqw", params);
  const user = await User.findOne({ email: params.email });
  if (!user) {
    return { success: false };
  }
  return { success: true, user: user };
}

async function Login(params) {
  try {
    const user = await User.findOne({ email: params.email });
    console.log("account", params.email);

    if (!user) {
      return {
        status: false,
        code: 404,
        message: "Tài khoản không tồn tại!",
      };
    }

    console.log("Mật khẩu nhận được:", params.password);

    const checkPassword = await bcrypt.compare(params.password, user.password);
    if (!checkPassword) {
      return {
        status: false,
        code: 401,
        message: "Mật khẩu không chính xác",
      };
    }

    const sendotp = await sendOTP(params.email);
    console.log("Gửi OTP:", sendotp);

    if (!sendotp) {
      return {
        status: false,
        code: 500,
        message: "Không thể gửi OTP. Vui lòng thử lại sau.",
      };
    }

    return {
      status: true,
      code: 200,
      message: "Gửi OTP thành công. Vui lòng kiểm tra email.",
      data: { email: params.email },
    };
  } catch (err) {
    console.error("Lỗi hệ thống:", err);
    return {
      status: false,
      code: 500,
      message: "Đã xảy ra lỗi. Vui lòng thử lại sau.",
    };
  }
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
    license: true,
  });
  try {
    await newUser.save();
  } catch (error) {
    return { success: false, message: "Đăng kí thất bại", newUser };
  }

  return { success: true, message: "Đăng kí thành công", newUser };
}

module.exports = {
  Login,
  Register,
  getUserByEmail,
};
