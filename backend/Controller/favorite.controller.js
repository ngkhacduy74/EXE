const Favorite = require("../Model/favorite.model");
const Product = require("../Model/product.model");

// Thêm sản phẩm vào danh sách yêu thích
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;

    // Debug: Log cấu trúc req.user
    console.log("req.user:", JSON.stringify(req.user, null, 2));

    // Lấy userId với nhiều cách khác nhau để đảm bảo
    let userId =
      req.user?.user?._id ||
      req.user?.user?.id ||
      req.user?.id ||
      req.user?._id;

    console.log("Extracted userId:", userId);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
    }

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID là bắt buộc",
      });
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm",
      });
    }

    // Kiểm tra xem đã lưu chưa
    const existingFavorite = await Favorite.findOne({
      userId,
      productId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Sản phẩm đã có trong danh sách yêu thích",
      });
    }

    // Thêm vào danh sách yêu thích
    const newFavorite = new Favorite({
      userId,
      productId,
    });

    await newFavorite.save();

    res.status(201).json({
      success: true,
      message: "Đã thêm sản phẩm vào danh sách yêu thích",
      data: newFavorite,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm vào danh sách yêu thích",
    });
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    let userId =
      req.user?.user?._id ||
      req.user?.user?.id ||
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      userId,
      productId,
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sản phẩm trong danh sách yêu thích",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa sản phẩm khỏi danh sách yêu thích",
    });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa khỏi danh sách yêu thích",
    });
  }
};

// Lấy danh sách sản phẩm yêu thích
const getFavorites = async (req, res) => {
  try {
    let userId =
      req.user?.user?._id ||
      req.user?.user?.id ||
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
    }

    const { page = 1, limit = 20 } = req.query;

    const favorites = await Favorite.find({ userId })
      .populate("productId", "name brand price image category status")
      .sort({ addedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Favorite.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: favorites,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error getting favorites:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách yêu thích",
    });
  }
};

// Kiểm tra sản phẩm có trong danh sách yêu thích không
const checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    let userId =
      req.user?.user?._id ||
      req.user?.user?.id ||
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
    }

    const favorite = await Favorite.findOne({
      userId,
      productId,
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    console.error("Error checking favorite:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi kiểm tra trạng thái yêu thích",
    });
  }
};

// Xóa tất cả sản phẩm yêu thích
const clearAllFavorites = async (req, res) => {
  try {
    let userId =
      req.user?.user?._id ||
      req.user?.user?.id ||
      req.user?.id ||
      req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Không thể xác định người dùng. Vui lòng đăng nhập lại.",
      });
    }

    await Favorite.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Đã xóa tất cả sản phẩm yêu thích",
    });
  } catch (error) {
    console.error("Error clearing favorites:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa danh sách yêu thích",
    });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
  clearAllFavorites,
};
