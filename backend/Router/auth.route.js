const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/index");
const { uploadAvatarMiddleware } = require("../Middleware/file.middleware");
const {
  Login,
  Register,
  Refresh_Token,
} = require("../Controller/auth.controller");

router.post("/login", async (req, res) => {
  try {
    console.log("Login request body:", req.body);
    const result = await Login(req.body);
    console.log("Login result:", result);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Đăng nhập thất bại, vui lòng thử lại."
    });
  }
});

router.post("/register", uploadAvatarMiddleware, async (req, res) => {
  try {
    console.log("Register request body:", req.body);
    console.log("Register request files:", req.files);
    
    // Handle file upload if present
    let avatarUrl = null;
    if (req.files && req.files.ava_img_url) {
      const file = req.files.ava_img_url[0];
      avatarUrl = file.path; // This will be the uploaded file path
      console.log("Avatar uploaded:", avatarUrl);
    }
    
    // Prepare data for Register function
    const registerData = {
      ...req.body,
      ava_img_url: avatarUrl
    };
    
    const result = await Register(registerData);
    console.log("Register result:", result);
    
    if (result.success === false) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Đăng ký thất bại, vui lòng thử lại."
    });
  }
});

router.post("/refresh-token", async (req, res) => {
  const refresh = req.body;

  if (!refresh) {
    return res
      .status(400)
      .json({ success: false, error: "Thiếu refresh token" });
  }
  const result = await Refresh_Token(refresh);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
