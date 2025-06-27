const Product = require("../Model/product.model");
const Post = require("../Model/post.model");
const User = require("../Model/user.model");

// Simple responses for basic greetings
const simpleResponses = {
  "xin chào": "Xin chào! Tôi là trợ lý AI của Vinsaky Shop. Tôi có thể giúp gì cho bạn hôm nay?",
  "hello": "Hello! Tôi là trợ lý AI của Vinsaky Shop. Tôi có thể giúp gì cho bạn hôm nay?",
  "chào": "Chào bạn! Tôi là trợ lý AI của Vinsaky Shop. Tôi có thể giúp gì cho bạn hôm nay?",
  "cảm ơn": "Không có gì! Nếu bạn cần thêm thông tin gì, đừng ngại hỏi nhé!",
  "tạm biệt": "Tạm biệt! Chúc bạn một ngày tốt lành. Hẹn gặp lại!",
  "bye": "Tạm biệt! Chúc bạn một ngày tốt lành. Hẹn gặp lại!"
};

// Hàm tìm kiếm sản phẩm linh hoạt - cải thiện
async function searchProducts(query) {
  try {
    if (!query || query.trim() === '') {
      return await Product.find().sort({ createdAt: -1 }).limit(5);
    }

    // Tách từ khóa tìm kiếm
    const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 1);
    
    if (keywords.length > 0) {
      const searchConditions = [];
      
      // Tìm kiếm theo tên sản phẩm
      searchConditions.push({ name: { $regex: query, $options: 'i' } });
      
      // Tìm kiếm theo thương hiệu
      searchConditions.push({ brand: { $regex: query, $options: 'i' } });
      
      // Tìm kiếm theo mô tả
      searchConditions.push({ description: { $regex: query, $options: 'i' } });
      
      // Tìm kiếm theo từng từ khóa riêng lẻ
      keywords.forEach(keyword => {
        searchConditions.push({ name: { $regex: keyword, $options: 'i' } });
        searchConditions.push({ brand: { $regex: keyword, $options: 'i' } });
        searchConditions.push({ description: { $regex: keyword, $options: 'i' } });
      });
      
      const products = await Product.find({
        $or: searchConditions
      }).sort({ createdAt: -1 }).limit(5);

      return products;
    }

    return [];
  } catch (error) {
    console.error("Lỗi tìm kiếm sản phẩm:", error);
    return [];
  }
}

// Hàm tìm kiếm bài viết linh hoạt
async function searchPosts(query) {
  try {
    if (!query || query.trim() === '') {
      return await Post.find({ condition: "Active" }).sort({ createdAt: -1 }).limit(3);
    }

    const searchRegex = new RegExp(query, 'i');
    
    const posts = await Post.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex }
      ],
      condition: "Active"
    }).sort({ createdAt: -1 }).limit(3);

    return posts;
  } catch (error) {
    console.error("Lỗi tìm kiếm bài viết:", error);
    return [];
  }
}

// Hàm lấy thống kê cơ bản
async function getStatistics() {
  try {
    const [totalProducts, newProducts, usedProducts, totalPosts, activePosts] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ status: "New" }),
      Product.countDocuments({ status: "SecondHand" }),
      Post.countDocuments(),
      Post.countDocuments({ condition: "Active" })
    ]);
    
    return {
      totalProducts,
      newProducts,
      usedProducts,
      totalPosts,
      activePosts
    };
  } catch (error) {
    console.error("Lỗi lấy thống kê:", error);
    return null;
  }
}

// Lấy tất cả sản phẩm để hiển thị khi không tìm thấy
async function getAllProducts(limit = 5) {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    return products;
  } catch (error) {
    console.error("Lỗi lấy tất cả sản phẩm:", error);
    return [];
  }
}

// Lấy sản phẩm theo thương hiệu
async function getProductsByBrand(brand, limit = 5) {
  try {
    const products = await Product.find({ 
      brand: new RegExp(brand, 'i') 
    })
      .sort({ createdAt: -1 })
      .limit(limit);
    return products;
  } catch (error) {
    console.error("Lỗi lấy sản phẩm theo thương hiệu:", error);
    return [];
  }
}

// Lấy sản phẩm theo loại (tủ lạnh, máy làm đá, etc.)
async function getProductsByType(type, limit = 5) {
  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: type, $options: 'i' } },
        { description: { $regex: type, $options: 'i' } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(limit);
    return products;
  } catch (error) {
    console.error("Lỗi lấy sản phẩm theo loại:", error);
    return [];
  }
}

// Hàm xử lý câu hỏi chính - linh hoạt hơn
async function handleUserQuestion(userText) {
  try {
    const text = userText.toLowerCase();
    
    // Xử lý câu hỏi về thống kê
    if (text.includes('thống kê') || text.includes('số liệu') || text.includes('bao nhiêu')) {
      const stats = await getStatistics();
      if (stats) {
        return `Thống kê hiện tại của Vinsaky Shop:\n\n` +
               `📦 Sản phẩm: ${stats.totalProducts} (Mới: ${stats.newProducts}, Đã qua sử dụng: ${stats.usedProducts})\n` +
               `📝 Bài viết: ${stats.totalPosts} (Đang hoạt động: ${stats.activePosts})\n\n` +
               `Bạn muốn tìm hiểu thêm về sản phẩm hay bài viết nào không?`;
      }
    }

    // Xử lý câu hỏi về đánh giá sản phẩm
    if (text.includes('có ngon không') || text.includes('tốt không') || text.includes('chất lượng') || 
        text.includes('đánh giá') || text.includes('review') || text.includes('so sánh')) {
      
      // Tìm kiếm sản phẩm được đề cập
      const productKeywords = text.split(' ').filter(word => 
        word.length > 2 && !['có', 'ngon', 'không', 'tốt', 'chất', 'lượng', 'đánh', 'giá', 'review', 'so', 'sánh'].includes(word)
      );
      
      if (productKeywords.length > 0) {
        const searchQuery = productKeywords.join(' ');
        const products = await searchProducts(searchQuery);
        
        if (products.length > 0) {
          let response = `Về sản phẩm ${products[0].name}:\n\n`;
          
          // Thông tin cơ bản
          response += `📋 Thông tin sản phẩm:\n`;
          response += `• Thương hiệu: ${products[0].brand}\n`;
          response += `• Giá: ${products[0].price}\n`;
          response += `• Trạng thái: ${products[0].status}\n`;
          response += `• Bảo hành: ${products[0].warranty_period} tháng\n`;
          
          if (products[0].description) {
            response += `• Mô tả: ${products[0].description.substring(0, 200)}...\n\n`;
          }
          
          // Đánh giá dựa trên thông tin có sẵn
          response += `⭐ Đánh giá:\n`;
          if (products[0].status === 'New') {
            response += `• Sản phẩm mới, chất lượng đảm bảo\n`;
          } else {
            response += `• Sản phẩm đã qua sử dụng, giá tốt\n`;
          }
          
          if (products[0].warranty_period >= 12) {
            response += `• Bảo hành dài hạn (${products[0].warranty_period} tháng)\n`;
          }
          
          response += `• Liên hệ: ${products[0].business_phone} để được tư vấn chi tiết\n\n`;
          response += `Bạn có muốn xem thêm sản phẩm tương tự không?`;
          
          return response;
        }
      }
    }

    // Xử lý câu hỏi về sản phẩm mới
    if (text.includes('sản phẩm mới') || text.includes('hàng mới') || text.includes('mới nhất')) {
      const newProducts = await Product.find({ status: "New" }).sort({ createdAt: -1 }).limit(5);
      if (newProducts.length > 0) {
        const productList = newProducts.map(product => 
          `• ${product.name} (${product.brand}) - ${product.price}`
        ).join('\n');
        
        return `Các sản phẩm mới nhất:\n\n${productList}\n\nBạn có muốn xem chi tiết sản phẩm nào không?`;
      }
    }

    // Xử lý câu hỏi về sản phẩm đã qua sử dụng
    if (text.includes('đã qua sử dụng') || text.includes('cũ') || text.includes('second hand')) {
      const usedProducts = await Product.find({ status: "SecondHand" }).sort({ createdAt: -1 }).limit(5);
      if (usedProducts.length > 0) {
        const productList = usedProducts.map(product => 
          `• ${product.name} (${product.brand}) - ${product.price}`
        ).join('\n');
        
        return `Các sản phẩm đã qua sử dụng:\n\n${productList}\n\nBạn có muốn xem chi tiết sản phẩm nào không?`;
      }
    }

    // Tìm kiếm sản phẩm theo từ khóa
    const products = await searchProducts(userText);
    if (products.length > 0) {
      const productList = products.map(product => 
        `• ${product.name} (${product.brand}) - ${product.price}`
      ).join('\n');
      
      return `Tôi tìm thấy các sản phẩm phù hợp:\n\n${productList}\n\nBạn có muốn xem chi tiết sản phẩm nào không?`;
    }

    // Tìm kiếm bài viết theo từ khóa
    const posts = await searchPosts(userText);
    if (posts.length > 0) {
      const postList = posts.map(post => 
        `• ${post.title} (${post.category})`
      ).join('\n');
      
      return `Tôi tìm thấy các bài viết liên quan:\n\n${postList}\n\nBạn có muốn đọc bài viết nào không?`;
    }

    // Nếu không tìm thấy sản phẩm cụ thể, hiển thị thông tin hữu ích
    const stats = await getStatistics();
    const allProducts = await getAllProducts(3);
    
    let response = `Tôi không tìm thấy sản phẩm "${userText}" trong cơ sở dữ liệu.\n\n`;
    
    if (stats) {
      response += `Hiện tại chúng tôi có:\n` +
                 `📦 ${stats.totalProducts} sản phẩm (${stats.newProducts} mới, ${stats.usedProducts} đã qua sử dụng)\n` +
                 `📝 ${stats.totalPosts} bài viết (${stats.activePosts} đang hoạt động)\n\n`;
    }

    if (allProducts.length > 0) {
      response += `Một số sản phẩm có sẵn:\n`;
      const productList = allProducts.map(product => 
        `• ${product.name} (${product.brand}) - ${product.price}`
      ).join('\n');
      response += `${productList}\n\n`;
    }

    // Kiểm tra xem có phải tìm kiếm theo thương hiệu không
    const brandKeywords = ['fushimavina', 'ababa', 'samsung', 'lg', 'panasonic'];
    const foundBrand = brandKeywords.find(brand => text.includes(brand));
    
    if (foundBrand) {
      const brandProducts = await getProductsByBrand(foundBrand, 3);
      if (brandProducts.length > 0) {
        response += `Sản phẩm ${foundBrand.toUpperCase()} có sẵn:\n`;
        const brandProductList = brandProducts.map(product => 
          `• ${product.name} - ${product.price}`
        ).join('\n');
        response += `${brandProductList}\n\n`;
      }
    }

    // Kiểm tra xem có phải tìm kiếm theo loại sản phẩm không
    const typeKeywords = ['tủ', 'lạnh', 'đông', 'máy', 'làm', 'đá', 'viên', 'cấp'];
    const foundType = typeKeywords.find(type => text.includes(type));
    
    if (foundType) {
      const typeProducts = await getProductsByType(foundType, 3);
      if (typeProducts.length > 0) {
        response += `Sản phẩm ${foundType} có sẵn:\n`;
        const typeProductList = typeProducts.map(product => 
          `• ${product.name} (${product.brand}) - ${product.price}`
        ).join('\n');
        response += `${typeProductList}\n\n`;
      }
    }

    response += `Bạn có thể:\n` +
               `• Tìm kiếm với từ khóa khác\n` +
               `• Xem tất cả sản phẩm\n` +
               `• Hỏi về sản phẩm mới nhất\n` +
               `• Hỏi về sản phẩm đã qua sử dụng`;

    return response;
  } catch (error) {
    console.error("Lỗi xử lý câu hỏi:", error);
    return null;
  }
}

async function getChatResponse(userMessages) {
  try {
    // Lấy tin nhắn cuối cùng từ user
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (!lastUserMessage || lastUserMessage.role !== "user") {
      return "Xin lỗi, tôi không hiểu. Bạn có thể nói rõ hơn được không?";
    }

    const userText = lastUserMessage.content.toLowerCase();
    
    // Kiểm tra câu trả lời đơn giản trước
    for (const [keyword, response] of Object.entries(simpleResponses)) {
      if (userText.includes(keyword)) {
        return response;
      }
    }

    // Xử lý câu hỏi chính
    const response = await handleUserQuestion(userText);
    if (response) {
      return response;
    }

    // Nếu không tìm thấy gì, trả về thông tin chung
    const stats = await getStatistics();
    if (stats) {
      return `Tôi hiểu bạn đang tìm kiếm thông tin. Hiện tại chúng tôi có:\n\n` +
             `📦 ${stats.totalProducts} sản phẩm (${stats.newProducts} mới, ${stats.usedProducts} đã qua sử dụng)\n` +
             `📝 ${stats.totalPosts} bài viết (${stats.activePosts} đang hoạt động)\n\n` +
             `Bạn có thể hỏi tôi về:\n` +
             `• Sản phẩm cụ thể\n` +
             `• Sản phẩm mới nhất\n` +
             `• Sản phẩm đã qua sử dụng\n` +
             `• Bài viết theo chủ đề\n` +
             `• Thống kê chi tiết`;
    }

    return "Tôi là trợ lý AI của Vinsaky Shop. Tôi có thể giúp bạn tìm kiếm sản phẩm, đọc bài viết, hoặc trả lời các câu hỏi khác. Bạn cần gì?";

  } catch (err) {
    console.error("Lỗi chat response:", err.message);
    return "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại sau.";
  }
}

module.exports = getChatResponse;
