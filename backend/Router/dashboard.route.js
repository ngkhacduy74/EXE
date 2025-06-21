const express = require("express");
const router = express.Router();
const DashboardController = require("../Controller/dashboard.controller");
const authMiddleware = require("../Middleware/auth.middleware");

// Get dashboard statistics
router.get("/stats", authMiddleware.verifyAdmin, DashboardController.getDashboardStats);

// Get real-time analytics
router.get("/realtime", authMiddleware.verifyAdmin, DashboardController.getRealTimeAnalytics);

// Get detailed analytics
router.get("/analytics", authMiddleware.verifyAdmin, DashboardController.getDetailedAnalytics);

module.exports = router; 