const SearchHistory = require("../Model/searchHistory.model");
const Product = require("../Model/product.model");
const Post = require("../Model/post.model");
const mongoose = require("mongoose");

// Lưu lịch sử tìm kiếm
const saveSearchHistory = async (req, res) => {
  try {
    const { searchQuery, searchType, searchResults, category, filters } =
      req.body;
    const userId = req.user.id;

    // Chỉ lưu nếu có searchQuery (người dùng nhập từ khóa)
    if (!searchQuery || !searchQuery.trim()) {
      return res.status(400).json({
        success: false,
        message: "Chỉ lưu lịch sử khi có từ khóa tìm kiếm.",
      });
    }

    // Kiểm tra xem từ khóa này đã được tìm kiếm trước đó chưa
    let existingSearch = await SearchHistory.findOne({
      userId,
      searchQuery: searchQuery.toLowerCase(),
      searchType,
    });

    if (existingSearch) {
      // Nếu đã tồn tại, tăng số lần tìm kiếm và cập nhật thời gian
      existingSearch.searchCount += 1;
      existingSearch.lastSearched = new Date();
      existingSearch.searchResults =
        searchResults || existingSearch.searchResults;
      existingSearch.category = category || existingSearch.category;
      existingSearch.filters = filters || existingSearch.filters;
      await existingSearch.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật lịch sử tìm kiếm",
        data: existingSearch,
      });
    } else {
      // Nếu chưa tồn tại, tạo mới
      const newSearchHistory = new SearchHistory({
        userId,
        searchQuery: searchQuery.toLowerCase(),
        searchType: searchType || "product",
        searchResults: searchResults || [],
        category,
        filters,
      });
      await newSearchHistory.save();
      res.status(201).json({
        success: true,
        message: "Lưu lịch sử tìm kiếm thành công",
        data: newSearchHistory,
      });
    }
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lưu lịch sử tìm kiếm",
    });
  }
};

// Lấy lịch sử tìm kiếm của user
const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, searchType } = req.query;

    const query = { userId };
    if (searchType) {
      query.searchType = searchType;
    }

    const searchHistory = await SearchHistory.find(query)
      .sort({ lastSearched: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("searchResults.productId", "name brand price image")
      .populate("searchResults.postId", "title content image");

    const total = await SearchHistory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: searchHistory,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error getting search history:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy lịch sử tìm kiếm",
    });
  }
};

// Lấy đề xuất tìm kiếm dựa trên lịch sử
const getSearchSuggestions = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { limit = 10, searchType = "product" } = req.query;

    let popularSearches = [];
    let viewedProducts = [];
    let products = [];

    if (userId) {
      // Lấy các từ khóa tìm kiếm phổ biến nhất của user
      popularSearches = await SearchHistory.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            searchType: searchType,
          },
        },
        {
          $group: {
            _id: "$searchQuery",
            searchCount: { $sum: "$searchCount" },
            lastSearched: { $max: "$lastSearched" },
            category: { $first: "$category" },
          },
        },
        { $sort: { searchCount: -1, lastSearched: -1 } },
        { $limit: parseInt(limit) },
      ]);

      // Lấy các sản phẩm đã xem qua tìm kiếm
      viewedProducts = await SearchHistory.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            "searchResults.productId": { $exists: true, $ne: null },
          },
        },
        { $unwind: "$searchResults" },
        {
          $group: {
            _id: "$searchResults.productId",
            viewCount: { $sum: 1 },
            lastView: { $max: "$lastSearched" },
          },
        },
        { $sort: { viewCount: -1, lastView: -1 } },
        { $limit: 5 },
      ]);

      // Lấy thông tin chi tiết sản phẩm
      const productIds = viewedProducts.map((item) => item._id);
      products = await Product.find({ _id: { $in: productIds } })
        .select("name brand price image category status")
        .limit(5);
    }

    // Lấy các từ khóa tìm kiếm phổ biến toàn hệ thống
    const trendingSearches = await SearchHistory.aggregate([
      {
        $group: {
          _id: "$searchQuery",
          totalSearches: { $sum: "$searchCount" },
          uniqueUsers: { $addToSet: "$userId" },
        },
      },
      {
        $project: {
          searchQuery: "$_id",
          totalSearches: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
        },
      },
      { $sort: { totalSearches: -1, uniqueUsers: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        popularSearches: popularSearches.map((item) => ({
          searchQuery: item._id,
          searchCount: item.searchCount,
          lastSearched: item.lastSearched,
          category: item.category,
        })),
        viewedProducts: products,
        trendingSearches: trendingSearches,
      },
    });
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy đề xuất tìm kiếm",
    });
  }
};

// Xóa một lịch sử tìm kiếm cụ thể
const deleteSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchId } = req.params;

    const searchHistory = await SearchHistory.findOneAndDelete({
      _id: searchId,
      userId,
    });

    if (!searchHistory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch sử tìm kiếm",
      });
    }

    res.status(200).json({
      success: true,
      message: "Đã xóa lịch sử tìm kiếm",
    });
  } catch (error) {
    console.error("Error deleting search history:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa lịch sử tìm kiếm",
    });
  }
};

// Xóa toàn bộ lịch sử tìm kiếm của user
const clearAllSearchHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    await SearchHistory.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Đã xóa toàn bộ lịch sử tìm kiếm",
    });
  } catch (error) {
    console.error("Error clearing search history:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa lịch sử tìm kiếm",
    });
  }
};

module.exports = {
  saveSearchHistory,
  getSearchHistory,
  getSearchSuggestions,
  deleteSearchHistory,
  clearAllSearchHistory,
};
