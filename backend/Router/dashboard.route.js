const express = require("express");
const router = express.Router();
const DashboardController = require("../Controller/dashboard.controller");
const authMiddleware = require("../Middleware/auth.middleware");

// CORS middleware for dashboard routes
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://vinsaky.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Get dashboard statistics
router.get("/stats", authMiddleware.verifyAdmin, DashboardController.getDashboardStats);

module.exports = router; 