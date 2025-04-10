const express = require("express");
const router = express.Router();
const authRouter = require("./auth.route");
const fileRouter = require("./file.router");
const otpRouter = require("./otp.router");
module.exports = (app) => {
  app.use("/auth", authRouter);
  app.use("/file", fileRouter);
  app.use("/otp", otpRouter);
};
