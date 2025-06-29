const express = require("express");
const router = express.Router();
const {
  saveSearchHistory,
  getSearchHistory,
  getSearchSuggestions,
  deleteSearchHistory,
  clearAllSearchHistory,
} = require("../Controller/searchHistory.controller");
const { authenticateToken } = require("../Middleware/auth.middleware");

// Tất cả routes đều cần authentication
router.use(authenticateToken);

// Lưu lịch sử tìm kiếm
router.post("/save", saveSearchHistory);

// Lấy lịch sử tìm kiếm của user
router.get("/history", getSearchHistory);

// Lấy đề xuất tìm kiếm dựa trên lịch sử
router.get("/suggestions", getSearchSuggestions);

// Xóa một lịch sử tìm kiếm cụ thể
router.delete("/history/:searchId", deleteSearchHistory);

// Xóa toàn bộ lịch sử tìm kiếm
router.delete("/history", clearAllSearchHistory);

module.exports = router;
