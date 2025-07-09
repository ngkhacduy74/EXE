const Product = require("../Model/product.model");
const Post = require("../Model/post.model");
const User = require("../Model/user.model");

class ChatService {
  constructor() {
    this.context = {};
    this.userPreferences = {};
    this.histories = new Map(); // { userId: [ {role,content} ] }
    this.lastProductSuggestions = [];
  }

  // Lưu 1 message vào lịch sử người dùng (tối đa 20 message ~ 10 lượt)
  addToHistory(userId, role, content) {
    if (!userId) return; // khách ẩn danh: không lưu
    if (!this.histories.has(userId)) this.histories.set(userId, []);
    const arr = this.histories.get(userId);
    arr.push({ role, content });
    if (arr.length > 20) {
      arr.splice(0, arr.length - 20);
    }
  }

  // Lấy tối đa 'limit' message gần nhất theo định dạng OpenAI
  getHistoryMessages(userId, limit = 20) {
    if (!userId || !this.histories.has(userId)) return [];
    const arr = this.histories.get(userId);
    const slice = arr.slice(-limit);
    return slice.map(m => ({ role: m.role, content: m.content }));
  }


  analyzeContext(userQuestion) {
    const question = userQuestion.toLowerCase();
  
    const compareKeywords = [
      'so sánh', 'compare', 'đối chiếu', 'khác biệt', 'giống nhau',
      'tốt hơn', 'xấu hơn', 'rẻ hơn', 'đắt hơn', 'chất lượng',
      'tính năng', 'ưu điểm', 'nhược điểm', 'lựa chọn'
    ];
  
    const productKeywords = [
      'sản phẩm', 'product', 'máy', 'tủ', 'đồ', 'hàng', 'item',
      'mua', 'bán', 'giá', 'price', 'thương hiệu', 'brand', 'kg', 'cân'
    ];
  
    const postKeywords = [
      'bài viết', 'post', 'article', 'tin tức', 'news', 'blog',
      'hướng dẫn', 'guide', 'tutorial', 'review', 'đánh giá'
    ];
  
    const statsKeywords = [
      'thống kê', 'statistics', 'số liệu', 'data', 'tổng quan',
      'overview', 'báo cáo', 'report', 'tình hình', 'situation'
    ];
  
    const reviewKeywords = [
      'ngon', 'tốt', 'xấu', 'chất lượng', 'quality', 'đánh giá',
      'review', 'feedback', 'ý kiến', 'opinion', 'có ngon không',
      'có tốt không', 'có xấu không'
    ];
  
    const newProductKeywords = ['sản phẩm mới', 'hàng mới', 'mới 100%', 'mới nhất', 'new product', 'new items'];
    const usedProductKeywords = ['đã qua sử dụng', 'hàng cũ', 'đã dùng', 'second hand', 'used product'];
  
    // Tự động nhận dạng câu hỏi tìm sản phẩm dựa trên trọng lượng hoặc mã sản phẩm
    const isLikelyProductSearch = /\d+\s*(kg|cân|fsm|fsm\d*)/i.test(question);  
    // Regex sẽ bắt tất cả:
    // - "50 kg", "50kg", "50 cân", "fsm30", "fsm 30"
  
    return {
      isCompareQuestion: compareKeywords.some(keyword => question.includes(keyword)),
      isProductQuestion: productKeywords.some(keyword => question.includes(keyword)) || isLikelyProductSearch,
      isPostQuestion: postKeywords.some(keyword => question.includes(keyword)),
      isStatsQuestion: statsKeywords.some(keyword => question.includes(keyword)),
      isReviewQuestion: reviewKeywords.some(keyword => question.includes(keyword)),
      isNewProductQuestion: newProductKeywords.some(keyword => question.includes(keyword)),
      isUsedProductQuestion: usedProductKeywords.some(keyword => question.includes(keyword)),
      question
    };
  }
  

  // Utility xoá dấu tiếng Việt
  removeVietnameseTones(str) {
    return str
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/[đĐ]/g, match => (match === 'đ' ? 'd' : 'D'))
      .replace(/[^\p{Letter}\p{Number}\s]/gu, '')
      .toLowerCase();
  }
  formatProductDetails(product) {
    return `📦 **${product.name}**
    
  💰 **Giá:** ${product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : 'Chưa có giá'}
  🏷️ **Thương hiệu:** ${product.brand || 'Không có thông tin'}
  📝 **Mô tả:** ${product.description || 'Không có mô tả'}
  ⭐ **Đánh giá:** ${product.rating || 'Chưa có đánh giá'}
  🔧 **Bảo hành:** ${product.warranty || 'Chưa có thông tin'}
  🏪 **Tình trạng:** ${product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}`;
  }
  
  
  async searchProducts(query) {
    try {
      const normalizeText = (text) => {
        return text
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/[đĐ]/g, match => (match === 'đ' ? 'd' : 'D'))
          .replace(/\s+/g, '')
          .replace(/[^\w]/g, '')
          .toLowerCase();
      };
  
      const normalizedQuery = normalizeText(query);
      const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  
      const looseQuery = {
        $or: tokens.map(token => ({
          $or: [
            { name: { $regex: token, $options: "i" } },
            { brand: { $regex: token, $options: "i" } }
          ]
        }))
      };
  
      let products = await Product.find(looseQuery).collation({ locale: 'vi', strength: 1 }).limit(20);
  
      if (products.length > 0) {
        const scoredProducts = products.map(product => {
          const text = normalizeText(`${product.name} ${product.brand}`);
          const score = tokens.filter(token => text.includes(normalizeText(token))).length;
          const exactMatch = text.includes(normalizedQuery);
          return { product, score, exactMatch };
        });
  
        scoredProducts.sort((a, b) => {
          if (a.exactMatch && !b.exactMatch) return -1;
          if (!a.exactMatch && b.exactMatch) return 1;
          return b.score - a.score;
        });
  
        products = scoredProducts.map(item => item.product).slice(0, 5); // lấy top 5
  
        // ✅ Lọc trọng lượng nếu có yêu cầu
        const weightMatch = query.match(/(\d+)\s*(kg|cân)/i);
        if (weightMatch) {
          const targetWeight = weightMatch[1];
          const filteredProducts = products.filter(product => {
            const text = `${product.name} ${product.brand}`.toLowerCase();
            return text.includes(`${targetWeight}kg`) || text.includes(`${targetWeight} kg`) || text.includes(`${targetWeight}cân`) || text.includes(`${targetWeight} cân`);
          });
  
          if (filteredProducts.length > 0) {
            products = filteredProducts;
          }
        }
  
        // ✅ Lọc theo giá với từ khóa mở rộng đầy đủ
        let minPrice = null;
        let maxPrice = null;
  
        // Giá tối đa
        const underPrice = query.match(/(dưới|<=|<|ít hơn|không quá|tối đa|nhiều nhất)\s*(\d+)\s*(tr|triệu)/i);
        if (underPrice) {
          maxPrice = parseInt(underPrice[2]) * 1000000;
        }
  
        // Giá tối thiểu
        const overPrice = query.match(/(trên|>=|>|nhiều hơn|tối thiểu|ít nhất)\s*(\d+)\s*(tr|triệu)/i);
        if (overPrice) {
          minPrice = parseInt(overPrice[2]) * 1000000;
        }
  
        if (minPrice !== null || maxPrice !== null) {
          products = products.filter(product => {
            const price = Number(product.price);
            if (isNaN(price)) return false;
            if (minPrice !== null && price < minPrice) return false;
            if (maxPrice !== null && price > maxPrice) return false;
            return true;
          });
        }
      }
  
      return products;
    } catch (error) {
      console.error("Lỗi tìm kiếm sản phẩm nâng cao:", error);
      return [];
    }
  }
  
  
  
  // Lấy danh sách sản phẩm mới
  async getNewProducts(limit = 10) {
    try {
      return await Product.find().sort({ createdAt: -1 }).limit(limit);
    } catch (err) {
      console.error('Lỗi lấy sản phẩm mới:', err);
      return [];
    }
  }

  // Lấy danh sách sản phẩm đã qua sử dụng
  async getUsedProducts(limit = 10) {
    try {
      return await Product.find({ condition: /used|cũ/i }).sort({ createdAt: -1 }).limit(limit);
    } catch (err) {
      console.error('Lỗi lấy sản phẩm cũ:', err);
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

        // Câu hỏi tiếp nối: yêu cầu xem thêm vài sản phẩm nếu đã gợi ý trước
        if (/(cho\s+tôi\s*(xem|coi)(\s+đi)?|xem\s+đi|xem\s+thêm|xem\s+tiếp|(xem|cho\s+tôi).*?((một|1|vài|nhiều)\s+)?(sản\s+phẩm|thiết\s+bị))/i.test(userQuestion)) {
          if (this.lastProductSuggestions.length) {
            return {
              answer: '',
              type: 'general_help',
              products: this.lastProductSuggestions.slice(0, 6) // trả tối đa 6
            };
          }
        }

        // Câu hỏi tiếp nối sử dụng "sản phẩm này" / "thiết bị này"...
      if (this.lastProductSuggestions.length && /(sản phẩm|thiết bị|máy|tủ)\s+này/i.test(userQuestion)) {
        const p = this.lastProductSuggestions[0];
        return {
          answer: '',
          type: 'general_help',
          products: [p]
        };
      }

      // Xử lý câu hỏi tìm kiếm sản phẩm
      if (context.isProductQuestion) {
        const products = await this.searchProducts(userQuestion);
        
        if (products.length > 0) {
          this.lastProductSuggestions = products; // lưu lại
          if (products.length === 1) {
            const p = products[0];
            // Mở rộng regex nhận diện ý định xem chi tiết sản phẩm
            const detailIntent = /(xem\s+chi\s+t(i|í)ết|chi\s+t(i|í)ết|spec|thông\s+số|cho\s+xem|tham\s+khảo|xem\s+sản\s+phẩm|chi\s+tiết\s+sản\s+phẩm|xem|xem\s+sp|thông\s+tin)/i;
            if (detailIntent.test(userQuestion)) {
              return {
                answer: this.formatProductDetails(p),
                type: 'product_detail',
                product: p
              };
            }
            // Không phải yêu cầu chi tiết → để AI tư vấn sâu hơn
            return {
              answer: '',
              type: 'general_help',
              products: [p]
            };
          }

          const productList = products.map(product => 
            `• ${product.name} - ${product.brand} - ${product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : 'Chưa có giá'}`
          ).join('\n');

          // Trả về danh sách sản phẩm để AI tư vấn sâu hơn, không hiển thị kết quả tìm kiếm thô
          return {
            answer: '', // Để trống để Controller tiếp tục gọi AI
            type: 'general_help',
            products: products
          };
        } else {
          // Tìm sản phẩm tương tự
          // Thử tìm theo brand nếu không tìm thấy theo tên
          // === Bổ sung: chuẩn hóa brand để không phân biệt hoa thường, không dấu, hỗ trợ tìm gần đúng ===
          const extractBrand = (text) => {
            // Loại bỏ các từ không cần thiết
            return text.replace(/cho tôi xem|sản phẩm|hãng|thương hiệu|hãy|xin|vui lòng|tìm|xem|giới thiệu|gợi ý|của|hãng|hãng sản xuất|hãng sản phẩm|hãng máy|hãng tủ|hãng thiết bị/gi, '').trim();
          };
          const normalizeText = (text) => {
            return text
              .normalize('NFD')
              .replace(/\p{Diacritic}/gu, '')
              .replace(/[đĐ]/g, match => (match === 'đ' ? 'd' : 'D'))
              .replace(/\s+/g, '')
              .replace(/[^\w]/g, '')
              .toLowerCase();
          };
          const brandQuery = extractBrand(userQuestion);
          const allBrandProducts = await Product.find().limit(200); // lấy nhiều để lọc
          const allBrands = [...new Set(allBrandProducts.map(p => p.brand || ''))];
          const normalizedQuery = normalizeText(brandQuery);
          // 1. Tìm brand khớp hoàn toàn
          let matchedBrand = allBrands.find(b => normalizeText(b) === normalizedQuery);
          // 2. Nếu không có, tìm brand chứa từ khóa
          if (!matchedBrand) {
            matchedBrand = allBrands.find(b => normalizeText(b).includes(normalizedQuery));
          }
          // 3. Nếu vẫn không có, tìm brand gần đúng nhất (dựa trên số ký tự chung liên tiếp)
          function getSimilarity(a, b) {
            let matches = 0;
            for (let i = 0; i < Math.min(a.length, b.length); i++) {
              if (a[i] === b[i]) matches++;
            }
            return matches;
          }
          if (!matchedBrand) {
            let maxSim = 0;
            for (const b of allBrands) {
              const sim = getSimilarity(normalizeText(b), normalizedQuery);
              if (sim > maxSim && sim >= 3) { // chỉ lấy nếu có ít nhất 3 ký tự chung
                maxSim = sim;
                matchedBrand = b;
              }
            }
          }
          if (matchedBrand) {
            const brandProducts = allBrandProducts.filter(product =>
              normalizeText(product.brand || '') === normalizeText(matchedBrand)
            );
            if (brandProducts.length > 0) {
              const productList = brandProducts.map(product => 
                `• ${product.name} - ${product.brand} - ${product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : 'Chưa có giá'}`
              ).join('\n');
              return {
                answer: `🔍 **Các sản phẩm thuộc thương hiệu gần đúng "${matchedBrand}":**\n${productList}`,
                type: 'brand_products',
                products: brandProducts
              };
            }
          }
          // Nếu vẫn không có thì trả về gợi ý sản phẩm khác
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

            // Khi người dùng yêu cầu xem chi tiết nếu trước đó có sản phẩm gợi ý
      if (/(xem\s+chi\s+t(i|í)ết|chi\s+t(i|í)ết|spec|thông\s+số|cho\s+xem|tham\s+khảo|xem\s+sản\s+phẩm|chi\s+tiết\s+sản\s+phẩm|xem|xem\s+sp|thông\s+tin)/i.test(userQuestion) && this.lastProductSuggestions.length === 1) {
        const p = this.lastProductSuggestions[0];
        return {
          answer: this.formatProductDetails(p),
          type: 'product_detail',
          product: p
        };
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
      if (context.isNewProductQuestion) {
        const newProducts = await this.getNewProducts();
        if (newProducts.length) {
          return {
            answer: '📦 Dưới đây là một số sản phẩm mới nhất của Vinsaky:',
            products: newProducts,
            type: 'new_products'
          };
        }
      }

      if (context.isUsedProductQuestion) {
        const usedProducts = await this.getUsedProducts();
        if (usedProducts.length) {
          return {
            answer: '♻️ Đây là các sản phẩm đã qua sử dụng hiện có:',
            products: usedProducts,
            type: 'used_products'
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

      // ===== XỬ LÝ TÌM KIẾM SẢN PHẨM THEO GIÁ (MỞ RỘNG) =====
      const priceRegex = /(dưới|<=|<|ít hơn|không quá|tối đa|nhiều nhất|trên|>=|>|nhiều hơn|tối thiểu|ít nhất|=|bằng|từ|đổ xuống|trở xuống|tới|đến|max|cao nhất|không vượt quá|không lớn hơn)\s*(\d{1,3}(?:[.,]\d{3})*|\d+)(?:\s*đ|\s*vnđ|\s*tr|\s*triệu)?(?:\s*(đến|tới|đổ xuống|trở xuống|-)\s*(\d{1,3}(?:[.,]\d{3})*|\d+)(?:\s*đ|\s*vnđ|\s*tr|\s*triệu)?)?/i;
      const match = userQuestion.match(priceRegex);
      if (match) {
        let minPrice = null, maxPrice = null;
        const isMillion = /tr|triệu/i.test(userQuestion);
        const parsePrice = (str) => parseInt(str.replace(/[.,]/g, '')) * (isMillion ? 1000000 : 1);
        if (/dưới|<=|<|ít hơn|không quá|tối đa|nhiều nhất|đổ xuống|trở xuống|tới|đến|max|cao nhất|không vượt quá|không lớn hơn/i.test(match[1])) {
          maxPrice = parsePrice(match[2]);
        } else if (/trên|>=|>|nhiều hơn|tối thiểu|ít nhất/i.test(match[1])) {
          minPrice = parsePrice(match[2]);
        } else if (/=|bằng/i.test(match[1])) {
          minPrice = maxPrice = parsePrice(match[2]);
        } else if (/từ/i.test(match[1]) && match[4]) {
          minPrice = parsePrice(match[2]);
          maxPrice = parsePrice(match[4]);
        } else if (/từ/i.test(match[1]) && !match[4] && (userQuestion.includes('đổ xuống') || userQuestion.includes('trở xuống'))) {
          // Trường hợp: 'từ 13 triệu đổ xuống' => maxPrice = 13 triệu
          maxPrice = parsePrice(match[2]);
        }
        // Tìm sản phẩm theo minPrice, maxPrice
        const priceQuery = {};
        if (minPrice !== null) priceQuery.$gte = minPrice;
        if (maxPrice !== null) priceQuery.$lte = maxPrice;
        const products = await Product.find({ price: priceQuery }).limit(10);
        if (products.length > 0) {
          const productList = products.map(product => 
            `• ${product.name} - ${product.brand} - ${product.price ? `${parseFloat(product.price).toLocaleString('vi-VN')} VND` : 'Chưa có giá'}`
          ).join('\n');
          return {
            answer: `🔍 **Các sản phẩm phù hợp với mức giá bạn yêu cầu:**\n${productList}`,
            type: 'price_products',
            products: products
          };
        } else {
          return {
            answer: `❌ Không tìm thấy sản phẩm phù hợp với mức giá bạn yêu cầu.`,
            type: 'no_price_product'
          };
        }
      } else if (userQuestion.toLowerCase().includes('giá')) {
        // Nếu có từ 'giá' mà không bắt được số, trả về hướng dẫn
        return {
          answer: `Vui lòng nhập số tiền hợp lệ, ví dụ:\n- 'dưới 20 triệu'\n- '>= 15 triệu'\n- 'từ 10 đến 30 triệu'\n- 'từ 13 triệu đổ xuống'\n- '< 5 triệu'`,
          type: 'invalid_price'
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

// ====== GỢI Ý SẢN PHẨM ĐỘNG BẰNG AI ======
// Hàm này nhận yêu cầu text, sinh từ khóa bằng AI, tìm sản phẩm phù hợp nhất
async function suggestProductsByAI(userQuery) {
  try {
    // 1. Sinh từ khóa bằng AI (bạn cần có hàm generateKeywordsWithAI hoặc tương đương)
    const { generateKeywordsWithGroq } = require('../utils/keywordGenerator');
    const keywords = await generateKeywordsWithGroq(userQuery, '', 10);
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return { success: false, message: 'Không sinh được từ khóa phù hợp từ AI.' };
    }
    // 2. Tìm sản phẩm theo các từ khóa này
    const orQuery = keywords.flatMap(kw => ([
      { name: { $regex: kw, $options: 'i' } },
      { brand: { $regex: kw, $options: 'i' } },
      { description: { $regex: kw, $options: 'i' } },
      { 'features.title': { $regex: kw, $options: 'i' } }
    ]));
    let products = await Product.find({ $or: orQuery }).limit(20);
    if (products && products.length > 0) {
      return { success: true, keywords, products };
    }
    // 3. Nếu không có sản phẩm, trả về thông báo rõ ràng
    return { success: false, message: 'Hiện tại chưa có sản phẩm phù hợp với nhu cầu của bạn. Vui lòng liên hệ để được tư vấn thêm.' };
  } catch (err) {
    return { success: false, message: 'Lỗi khi gợi ý sản phẩm bằng AI', detail: err.message };
  }
}
ChatService.prototype.suggestProductsByAI = suggestProductsByAI;

module.exports = ChatService; 