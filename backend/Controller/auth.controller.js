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
  const user = await User.findOne({ email: params.email });
  console.log("account", params.email);
  if (!user) {
    throw new Error("Tài khoản không tồn tại!");
  }
  console.log("alkjdasdj", params.password);
  const checkPassword = await bcrypt.compare(params.password, user.password);
  if (!checkPassword) {
    throw new Error("Mật khẩu không chính xác");
  }
  const sendotp = await sendOTP(params.email);
  console.log("kajdkad", sendotp);
  if (sendotp) {
    console.log("OTP send successful");
  } else {
    throw new Error("không thể gửi OTP. Vui lòng thử lại sau.");
  }
  // cần xác minh được otp đã rồi mới đẩy token lên web
  return { success: true, email: params.email };
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
async function Refresh_Token(token) {
  console.log("1111111", token);
  try {
    const decoded = jwt.verify(token.refresh_token, process.env.REFRESH_TOKEN);
    console.log("adlajkd", decoded);
    if (decoded.type !== "refresh") {
      return {
        success: false,
        error: "Refresh token không hợp lệ, có thể bạn đang gửi access token",
      };
    }

    const newAccessToken = jwt.sign(
      {
        decoded,
        type: "access",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    const newRefreshToken = jwt.sign(
      {
        decoded,
        type: "refresh",
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "30d" }
    );

    return {
      success: true,
      token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  } catch (err) {
    return {
      success: false,
      error: "Refresh token không hợp lệ hoặc đã hết hạn",
    };
  }
}
module.exports = {
  Login,
  Register,
  getUserByEmail,
  Refresh_Token,
};
