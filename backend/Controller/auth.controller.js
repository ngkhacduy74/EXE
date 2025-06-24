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
  if (!user) {
    throw new Error("Tài khoản không tồn tại!");
  }
  const checkPassword = await bcrypt.compare(params.password, user.password);
  if (!checkPassword) {
    throw new Error("Mật khẩu không chính xác");
  }
  // Khi đăng nhập thành công, gửi OTP và KHÔNG sinh token ở đây (token sinh ở verifyOTP)
  const sendotp = await sendOTP(params.email);
  if (sendotp) {
    console.log("OTP send successful");
  } else {
    throw new Error("không thể gửi OTP. Vui lòng thử lại sau.");
  }
  // XÓA mọi token cũ (nếu có) để đảm bảo chỉ 1 nơi đăng nhập
  await User.findByIdAndUpdate(user._id, { currentToken: null });
  return { success: true, email: params.email };
}

async function Register(params) {
  const checkEmail = await User.findOne({ email: params.email });
  if (checkEmail) {
    return { success: false, message: "Email đã được đăng kí" };
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(params.password, salt);
  
  // Set default avatar if no image provided
  const defaultAvatar = "https://res.cloudinary.com/dtdwjplew/image/upload/v1737903159/9_gnxlmk.jpg";
  
  const newUser = new User({
    id: v1(),
    fullname: params.fullname,
    phone: params.phone,
    address: params.address || "",
    password: hashedPassword,
    email: params.email,
    gender: params.gender,
    role: "User",
    ava_img_url: params.ava_img_url || defaultAvatar,
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
  try {
    const decoded = jwt.verify(token.refresh_token, process.env.REFRESH_TOKEN);
    if (decoded.type !== "refresh") {
      return {
        success: false,
        error: "Refresh token không hợp lệ, có thể bạn đang gửi access token",
      };
    }
    const newAccessToken = jwt.sign(
      {
        user: decoded.user,
        type: "access",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );
    const newRefreshToken = jwt.sign(
      {
        user: decoded.user,
        type: "refresh",
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "30d" }
    );
    // Cập nhật currentToken cho user (chỉ cho phép 1 nơi đăng nhập)
    await User.findByIdAndUpdate(decoded.user._id, {
      currentToken: newAccessToken,
    });
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
