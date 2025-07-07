const express = require("express");
const { 
  ChatGpt, 
  getChatStatistics, 
  searchProductsForChat, 
  searchPostsForChat,
  getProductDetailsForChat,
  getPostDetailsForChat,
  askQuestion
} = require("../Controller/chatgpt.controller");
const router = express.Router();

let chatHistory = [];

// Endpoint chính để chat - Sử dụng ChatService mới
router.post("/ask", async (req, res) => {
  const { prompt } = req.body;

  console.log("[CHAT] Nhận prompt:", prompt);

  if (!prompt) {
    console.log("[CHAT] Thiếu prompt đầu vào");
    return res.status(400).json({
      success: false,
      error: "Thiếu prompt đầu vào",
    });
  }

  try {
    // Sử dụng ChatService mới để xử lý câu hỏi
    const result = await askQuestion(req, res);
    
    if (result) {
      console.log("[CHAT] ChatService trả lời:", result.answer);
      return result; // askQuestion đã gửi response
    }
  } catch (err) {
    console.error("Lỗi /ask:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server hoặc AI",
      details: err.message,
    });
  }
});

// Endpoint để lấy thống kê
router.get("/statistics", async (req, res) => {
  try {
    console.log("[CHAT] Yêu cầu lấy thống kê");
    const result = await getChatStatistics();
    
    if (result.success) {
      res.json({
        success: true,
        statistics: result.statistics
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (err) {
    console.error("Lỗi /statistics:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

// Endpoint để tìm kiếm sản phẩm
router.post("/search-products", async (req, res) => {
  const { query, filters } = req.body;

  console.log("[CHAT] Tìm kiếm sản phẩm:", { query, filters });

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Thiếu query tìm kiếm",
    });
  }

  try {
    const result = await searchProductsForChat({ query, filters });
    
    if (result.success) {
      res.json({
        success: true,
        products: result.products
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (err) {
    console.error("Lỗi /search-products:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

// Endpoint để tìm kiếm bài viết
router.post("/search-posts", async (req, res) => {
  const { query, filters } = req.body;

  console.log("[CHAT] Tìm kiếm bài viết:", { query, filters });

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Thiếu query tìm kiếm",
    });
  }

  try {
    const result = await searchPostsForChat({ query, filters });
    
    if (result.success) {
      res.json({
        success: true,
        posts: result.posts
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (err) {
    console.error("Lỗi /search-posts:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

// Endpoint để lấy chi tiết sản phẩm
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  console.log("[CHAT] Lấy chi tiết sản phẩm:", productId);

  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "Thiếu product ID",
    });
  }

  try {
    const result = await getProductDetailsForChat({ productId });
    
    if (result.success) {
      res.json({
        success: true,
        product: result.product
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (err) {
    console.error("Lỗi /product/:productId:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

// Endpoint để lấy chi tiết bài viết
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  console.log("[CHAT] Lấy chi tiết bài viết:", postId);

  if (!postId) {
    return res.status(400).json({
      success: false,
      error: "Thiếu post ID",
    });
  }

  try {
    const result = await getPostDetailsForChat({ postId });
    
    if (result.success) {
      res.json({
        success: true,
        post: result.post
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (err) {
    console.error("Lỗi /post/:postId:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

// Endpoint để xóa lịch sử chat
router.delete("/clear-history", (req, res) => {
  try {
    chatHistory = [];
    console.log("[CHAT] Đã xóa lịch sử chat");
    res.json({
      success: true,
      message: "Đã xóa lịch sử chat"
    });
  } catch (err) {
    console.error("Lỗi /clear-history:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

// Endpoint để lấy lịch sử chat
router.get("/history", (req, res) => {
  try {
    res.json({
      success: true,
      history: chatHistory
    });
  } catch (err) {
    console.error("Lỗi /history:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
      details: err.message,
    });
  }
});

module.exports = router;
