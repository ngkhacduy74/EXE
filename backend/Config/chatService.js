const Product = require("../Model/product.model");
const Post = require("../Model/post.model");
const User = require("../Model/user.model");

class ChatService {
  constructor() {
    this.context = {};
    this.userPreferences = {};
    this.conversationHistory = [];
  }

  // Phân tích ngữ cảnh câu hỏi
  analyzeContext(userQuestion) {
    const question = userQuestion.toLowerCase();
    
    // Từ khóa so sánh sản phẩm
    const compareKeywords = [
      'so sánh', 'compare', 'đối chiếu', 'khác biệt', 'giống nhau',
      'tốt hơn', 'xấu hơn', 'rẻ hơn', 'đắt hơn', 'chất lượng',
      'tính năng', 'ưu điểm', 'nhược điểm', 'lựa chọn'
    ];

    // Kiểm tra xem có phải câu hỏi về so sánh không
    const isCompareQuestion = compareKeywords.some(keyword => 
      question.includes(keyword)
    );

    // Từ khóa tìm kiếm sản phẩm
    const productKeywords = [
      'sản phẩm', 'product', 'máy', 'tủ', 'đồ', 'hàng', 'item',
      'mua', 'bán', 'giá', 'price', 'thương hiệu', 'brand'
    ];

    // Từ khóa tìm kiếm bài viết
    const postKeywords = [
      'bài viết', 'post', 'article', 'tin tức', 'news', 'blog',
      'hướng dẫn', 'guide', 'tutorial', 'review', 'đánh giá'
    ];

    // Từ khóa thống kê
    const statsKeywords = [
      'thống kê', 'statistics', 'số liệu', 'data', 'tổng quan',
      'overview', 'báo cáo', 'report', 'tình hình', 'situation'
    ];

    // Từ khóa đánh giá sản phẩm
    const reviewKeywords = [
      'ngon', 'tốt', 'xấu', 'chất lượng', 'quality', 'đánh giá',
      'review', 'feedback', 'ý kiến', 'opinion', 'có ngon không',
      'có tốt không', 'có xấu không'
    ];

    return {
      isCompareQuestion,
      isProductQuestion: productKeywords.some(keyword => question.includes(keyword)),
      isPostQuestion: postKeywords.some(keyword => question.includes(keyword)),
      isStatsQuestion: statsKeywords.some(keyword => question.includes(keyword)),
      isReviewQuestion: reviewKeywords.some(keyword => question.includes(keyword)),
      question
    };
  }

  // Tìm kiếm sản phẩm linh hoạt
  async searchProducts(query) {
    try {
      // Chỉ tìm kiếm theo tên sản phẩm và thương hiệu
      const products = await Product.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }
        ]
      }).limit(10);
      return products;
    } catch (error) {
      console.error('Lỗi tìm kiếm sản phẩm:', error);
      return [];
    }
  }

  // Tìm kiếm bài viết
  async searchPosts(query) {
    try {
      // Chỉ tìm kiếm theo nguyên chuỗi nhập vào, không tách từ
      const posts = await Post.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      }).limit(5);
      return posts;
    } catch (error) {
      console.error('Lỗi tìm kiếm bài viết:', error);
      return [];
    }
  }

  // Lấy thống kê tổng quan
  async getStatistics() {
    try {
      const totalProducts = await Product.countDocuments();
      const availableProducts = await Product.countDocuments({ quantity: { $gt: 0 } });
      const totalPosts = await Post.countDocuments();
      
      // Lấy danh mục sản phẩm phổ biến
      const categories = await Product.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Lấy thương hiệu phổ biến
      const brands = await Product.aggregate([
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      return {
        totalProducts,
        availableProducts,
        totalPosts,
        categories,
        brands
      };
    } catch (error) {
      console.error('Lỗi lấy thống kê:', error);
      return null;
    }
  }

  // Xử lý câu hỏi về so sánh sản phẩm
  async handleCompareQuestion(question) {
    const compareKeywords = ['so sánh', 'compare', 'đối chiếu', 'khác biệt'];
    const hasCompareKeyword = compareKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );

    if (hasCompareKeyword) {
      return {
        answer: `Tôi có thể giúp bạn so sánh sản phẩm! Vinsaky Shop có tính năng so sánh sản phẩm rất tiện lợi:

🔍 **Cách sử dụng tính năng so sánh:**
1. Nhấp vào menu "Tạo mới" (dấu +) trên header
2. Chọn "So sánh sản phẩm"
3. Tìm kiếm và thêm tối đa 4 sản phẩm để so sánh
4. Xem bảng so sánh chi tiết về giá, thương hiệu, dung lượng, đánh giá...

📊 **Tính năng so sánh bao gồm:**
• Hình ảnh sản phẩm
• Tên và thương hiệu
• Giá cả
• Đánh giá và xếp hạng
• Tình trạng kho hàng
• Dung lượng (nếu có)
• Mô tả chi tiết

💡 **Gợi ý:** Bạn có thể so sánh các sản phẩm cùng loại như tủ lạnh, máy giặt, hoặc các thương hiệu khác nhau để đưa ra lựa chọn tốt nhất.

Bạn muốn so sánh sản phẩm nào cụ thể không? Tôi có thể gợi ý một số sản phẩm phổ biến để so sánh.`,
        type: 'compare_guide'
      };
    }

    return null;
  }

  // Xử lý câu hỏi đánh giá sản phẩm
  async handleReviewQuestion(question) {
    const reviewKeywords = ['ngon', 'tốt', 'xấu', 'chất lượng', 'đánh giá'];
    const hasReviewKeyword = reviewKeywords.some(keyword => 
      question.toLowerCase().includes(keyword)
    );

    if (hasReviewKeyword) {
      // Tìm sản phẩm trong câu hỏi
      const products = await this.searchProducts(question);
      
      if (products.length > 0) {
        const product = products[0];
        const rating = product.rating || 0;
        const status = product.quantity > 0 ? 'Còn hàng' : 'Hết hàng';
        const warranty = product.warranty || 'Chưa có thông tin';
        
        let evaluation = '';
        if (rating >= 4) {
          evaluation = 'Sản phẩm được đánh giá rất tốt';
        } else if (rating >= 3) {
          evaluation = 'Sản phẩm được đánh giá khá tốt';
        } else if (rating >= 2) {
          evaluation = 'Sản phẩm được đánh giá trung bình';
        } else {
          evaluation = 'Sản phẩm cần cải thiện';
        }

        return {
          answer: `📦 **${product.name}**

⭐ **Đánh giá:** ${rating}/5 sao - ${evaluation}
💰 **Giá:** ${product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : 'Chưa có giá'}
🏪 **Tình trạng:** ${status}
🔧 **Bảo hành:** ${warranty}
📝 **Mô tả:** ${product.description || 'Chưa có mô tả'}

💡 **Gợi ý:** Bạn có thể xem chi tiết sản phẩm hoặc so sánh với các sản phẩm khác để đưa ra quyết định tốt nhất.`,
          type: 'product_review',
          product: product
        };
      }
    }

    return null;
  }

  // Xử lý câu hỏi chính
  async processQuestion(userQuestion) {
    try {
      const context = this.analyzeContext(userQuestion);
      
      // Xử lý câu hỏi so sánh sản phẩm
      const compareResponse = await this.handleCompareQuestion(userQuestion);
      if (compareResponse) {
        return compareResponse;
      }

      // Xử lý câu hỏi đánh giá sản phẩm
      const reviewResponse = await this.handleReviewQuestion(userQuestion);
      if (reviewResponse) {
        return reviewResponse;
      }

      // Xử lý câu hỏi tìm kiếm sản phẩm
      if (context.isProductQuestion) {
        const products = await this.searchProducts(userQuestion);
        
        if (products.length > 0) {
          const productList = products.map(product => 
            `• ${product.name} - ${product.brand} - ${product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : 'Chưa có giá'}`
          ).join('\n');

          return {
            answer: `🔍 **Kết quả tìm kiếm sản phẩm:**\n\n${productList}\n\n💡 **Gợi ý:** Bạn có thể:\n• Xem chi tiết sản phẩm\n• So sánh các sản phẩm với nhau\n• Tìm kiếm sản phẩm khác`,
            type: 'product_search',
            products: products
          };
        } else {
          // Tìm sản phẩm tương tự
          const allProducts = await Product.find().limit(5);
          const suggestions = allProducts.map(product => 
            `• ${product.name} - ${product.brand}`
          ).join('\n');

          return {
            answer: `❌ **Không tìm thấy sản phẩm phù hợp với "${userQuestion}"**

💡 **Gợi ý sản phẩm khác:**
${suggestions}

🔍 **Bạn có thể:**
• Thử tìm kiếm với từ khóa khác
• Xem tất cả sản phẩm
• Sử dụng tính năng so sánh sản phẩm`,
            type: 'no_product_found'
          };
        }
      }

      // Xử lý câu hỏi tìm kiếm bài viết
      if (context.isPostQuestion) {
        const posts = await this.searchPosts(userQuestion);
        
        if (posts.length > 0) {
          const postList = posts.map(post => 
            `• ${post.title} - ${post.category}`
          ).join('\n');

          return {
            answer: `📰 **Kết quả tìm kiếm bài viết:**\n\n${postList}`,
            type: 'post_search',
            posts: posts
          };
        }
      }

      // Xử lý câu hỏi thống kê
      if (context.isStatsQuestion) {
        const stats = await this.getStatistics();
        
        if (stats) {
          const categoryList = stats.categories.map(cat => 
            `• ${cat._id}: ${cat.count} sản phẩm`
          ).join('\n');

          const brandList = stats.brands.map(brand => 
            `• ${brand._id}: ${brand.count} sản phẩm`
          ).join('\n');

          return {
            answer: `📊 **Thống kê Vinsaky Shop:**

🛍️ **Sản phẩm:**
• Tổng số: ${stats.totalProducts} sản phẩm
• Còn hàng: ${stats.availableProducts} sản phẩm

📰 **Bài viết:** ${stats.totalPosts} bài viết

🏷️ **Danh mục phổ biến:**
${categoryList}

🏭 **Thương hiệu phổ biến:**
${brandList}`,
            type: 'statistics'
          };
        }
      }

      // Câu hỏi chung về so sánh sản phẩm
      if (userQuestion.includes('so sánh') || userQuestion.includes('compare')) {
        return {
          answer: `🔍 **Tính năng so sánh sản phẩm của Vinsaky Shop:**

✅ **Có thể so sánh tối đa 4 sản phẩm cùng lúc**
✅ **So sánh chi tiết:** giá, thương hiệu, dung lượng, đánh giá, tình trạng kho
✅ **Giao diện trực quan** với bảng so sánh dễ đọc
✅ **Tìm kiếm nhanh** sản phẩm để thêm vào so sánh

🚀 **Cách sử dụng:**
1. Nhấp vào menu "Tạo mới" (dấu +) trên header
2. Chọn "So sánh sản phẩm"
3. Tìm kiếm và thêm sản phẩm muốn so sánh
4. Xem bảng so sánh chi tiết

💡 **Gợi ý:** Bạn có thể so sánh các sản phẩm cùng loại hoặc khác thương hiệu để đưa ra lựa chọn tốt nhất!`,
          type: 'compare_info'
        };
      }

      // Trả lời mặc định
      return {
        answer: `Xin chào! Tôi là trợ lý AI của Vinsaky Shop. Tôi có thể giúp bạn:

🔍 **Tìm kiếm sản phẩm** - Hỏi về sản phẩm cụ thể
📊 **Xem thống kê** - Thông tin tổng quan về shop
📰 **Tìm bài viết** - Bài viết và hướng dẫn
⚖️ **So sánh sản phẩm** - Hướng dẫn sử dụng tính năng so sánh
⭐ **Đánh giá sản phẩm** - Thông tin chất lượng và đánh giá

Bạn cần hỗ trợ gì?`,
        type: 'general_help'
      };

    } catch (error) {
      console.error('Lỗi xử lý câu hỏi:', error);
      return {
        answer: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.',
        type: 'error'
      };
    }
  }

  // Lấy thông tin chi tiết sản phẩm
  async getProductDetails(productId) {
    try {
      const product = await Product.findOne({ id: productId });
      return product;
    } catch (error) {
      console.error("Lỗi lấy chi tiết sản phẩm:", error);
      return null;
    }
  }

  // Lấy thông tin chi tiết bài viết
  async getPostDetails(postId) {
    try {
      const post = await Post.findOne({ id: postId });
      return post;
    } catch (error) {
      console.error("Lỗi lấy chi tiết bài viết:", error);
      return null;
    }
  }

  // Tìm kiếm sản phẩm theo thương hiệu
  async searchProductsByBrand(brand) {
    try {
      const products = await Product.find({ 
        brand: new RegExp(brand, 'i') 
      }).sort({ createdAt: -1 }).limit(10);
      
      return products;
    } catch (error) {
      console.error("Lỗi tìm kiếm theo thương hiệu:", error);
      return [];
    }
  }

  // Tìm kiếm bài viết theo danh mục
  async searchPostsByCategory(category) {
    try {
      const posts = await Post.find({ 
        category: new RegExp(category, 'i'),
        condition: "Active"
      }).sort({ createdAt: -1 }).limit(10);
      
      return posts;
    } catch (error) {
      console.error("Lỗi tìm kiếm theo danh mục:", error);
      return [];
    }
  }
}

module.exports = ChatService; 