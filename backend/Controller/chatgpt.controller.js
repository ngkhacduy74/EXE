const getChatResponse = require("../Config/openAI");
const ChatService = require("../Config/chatService");

async function ChatGpt(data) {
  try {
    const response = await getChatResponse(data);
    return response;
  } catch (error) {
    console.error("Error in ChatGpt:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Tạo instance của ChatService
const chatService = new ChatService();

const askQuestion = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Câu hỏi không được để trống"
      });
    }

    console.log("Received question:", prompt);

    // Sử dụng ChatService để xử lý câu hỏi
    const response = await chatService.processQuestion(prompt);
    
    console.log("ChatService response:", response);

    return res.status(200).json({
      success: true,
      answer: response.answer,
      type: response.type,
      data: response.products || response.posts || null
    });

  } catch (error) {
    console.error("Error in askQuestion:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi xử lý câu hỏi",
      error: error.message
    });
  }
};

// Các function khác giữ nguyên
const getChatStatistics = async () => {
  try {
    const stats = await chatService.getStatistics();
    return {
      success: true,
      statistics: stats
    };
  } catch (error) {
    console.error("Error in getChatStatistics:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const searchProductsForChat = async ({ query, filters }) => {
  try {
    const products = await chatService.searchProducts(query);
    return {
      success: true,
      products: products
    };
  } catch (error) {
    console.error("Error in searchProductsForChat:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const searchPostsForChat = async ({ query, filters }) => {
  try {
    const posts = await chatService.searchPosts(query);
    return {
      success: true,
      posts: posts
    };
  } catch (error) {
    console.error("Error in searchPostsForChat:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const getProductDetailsForChat = async ({ productId }) => {
  try {
    const product = await chatService.getProductDetails(productId);
    if (product) {
      return {
        success: true,
        product: product
      };
    } else {
      return {
        success: false,
        error: "Không tìm thấy sản phẩm"
      };
    }
  } catch (error) {
    console.error("Error in getProductDetailsForChat:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

const getPostDetailsForChat = async ({ postId }) => {
  try {
    const post = await chatService.getPostDetails(postId);
    if (post) {
      return {
        success: true,
        post: post
      };
    } else {
      return {
        success: false,
        error: "Không tìm thấy bài viết"
      };
    }
  } catch (error) {
    console.error("Error in getPostDetailsForChat:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  ChatGpt,
  getChatStatistics,
  searchProductsForChat,
  searchPostsForChat,
  getProductDetailsForChat,
  getPostDetailsForChat,
  askQuestion
};
