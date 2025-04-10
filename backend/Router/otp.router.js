const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../Controller/otp.controller");

router.get("/sendOTP", sendOTP);
router.get("/verifyOTP", verifyOTP);

module.exports = router;
