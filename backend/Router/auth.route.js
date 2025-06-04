const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/index");
const {
  Login,
  Register,
  Refresh_Token,
} = require("../Controller/auth.controller");

router.post("/login", async (req, res) => {
  const result = await Login(req.body);
  if (!result) {
    res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.post("/register", authMiddleware.validateUser, async (req, res) => {
  const result = await Register(req.body);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
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
