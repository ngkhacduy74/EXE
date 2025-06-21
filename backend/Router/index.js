const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const fileRouter = require("./file.router");
const otpRouter = require("./otp.router");
const productRouter = require("./product.router");
const postRouter = require("./post.router");
const userRouter = require("./user.router");
const chatRouter = require("./chat.router");
const bannerRouter = require("./banner.route");
const dashboardRouter = require("./dashboard.route");

module.exports = (app) => {
  app.use("/auth", authRouter);
  app.use("/file", fileRouter);
  app.use("/otp", otpRouter);
  app.use("/product", productRouter);
  app.use("/post", postRouter);
  app.use("/user", userRouter);
  app.use("/chat", chatRouter);
  app.use("/banner", bannerRouter);
  app.use("/api/dashboard", dashboardRouter);
};
