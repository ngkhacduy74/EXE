const express = require("express");
const router = express.Router();
const favoriteController = require("../Controller/favorite.controller");
const authMiddleware = require("../Middleware/auth.middleware");

// Tất cả routes đều yêu cầu authentication
router.use(authMiddleware.verifyToken);

// Thêm sản phẩm vào danh sách yêu thích
router.post("/add", favoriteController.addToFavorites);

// Xóa sản phẩm khỏi danh sách yêu thích
router.delete("/remove/:productId", favoriteController.removeFromFavorites);

// Lấy danh sách sản phẩm yêu thích
router.get("/list", favoriteController.getFavorites);

// Kiểm tra sản phẩm có trong danh sách yêu thích không
router.get("/check/:productId", favoriteController.checkFavorite);

// Xóa tất cả sản phẩm yêu thích
router.delete("/clear", favoriteController.clearAllFavorites);

module.exports = router;
