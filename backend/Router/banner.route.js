const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/index");
const {
  getBannerProducts,
  saveBannerProducts,
  clearBannerProducts,
} = require("../Controller/banner.controller");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Banner route is working!" });
});

// Get banner products (public)
router.get("/", getBannerProducts);

// Save banner products (Admin only)
router.post("/save", authMiddleware.verifyAdmin, saveBannerProducts);

// Clear banner products (Admin only)
router.delete("/clear", authMiddleware.verifyAdmin, clearBannerProducts);

module.exports = router; 