const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP } = require("../Controller/otp.controller");

// Create middleware for sendOTP
const sendOTPMiddleware = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: "Email là bắt buộc" 
      });
    }
    
    const result = await sendOTP(email);
    if (result) {
      res.status(200).json({ 
        success: true, 
        message: "OTP đã được gửi thành công" 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: "Không thể gửi OTP" 
      });
    }
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Lỗi máy chủ" 
    });
  }
};

router.get("/sendOTP", sendOTPMiddleware);
router.get("/verifyOTP", verifyOTP);

module.exports = router;
