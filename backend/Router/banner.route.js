const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/index");
const {
  getBannerProducts,
  getBannerProductIds,
  addProductIdToBanner,
  removeProductIdFromBanner,
  updateBannerProductIdsOrder,
  saveBannerProducts,
  clearBannerProducts,
} = require("../Controller/banner.controller");

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Banner route is working!" });
});

// Get banner products (public)
router.get("/", getBannerProducts);

// Banner Product IDs Management Routes
// Get banner product IDs (public)
router.get("/ids", getBannerProductIds);

// Add product ID to banner (Admin only)
router.post("/ids/add", authMiddleware.verifyAdmin, addProductIdToBanner);

// Remove product ID from banner (Admin only)
router.delete("/ids/:productId", authMiddleware.verifyAdmin, removeProductIdFromBanner);

// Update banner product IDs order (Admin only)
router.put("/ids/order", authMiddleware.verifyAdmin, updateBannerProductIdsOrder);

// Save banner products (Admin only)
router.post("/save", authMiddleware.verifyAdmin, saveBannerProducts);

// Clear banner products (Admin only)
router.delete("/clear", authMiddleware.verifyAdmin, clearBannerProducts);

module.exports = router; 