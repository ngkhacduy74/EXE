const bannerModel = require("../Model/banner.model");
const { BannerProduct, BannerProductIds } = bannerModel;

// Get all active banner products
const getBannerProducts = async (req, res) => {
  try {
    const bannerProducts = await BannerProduct.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: bannerProducts,
    });
  } catch (error) {
    console.error("Error fetching banner products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải banner products",
    });
  }
};

// Get banner product IDs (public)
const getBannerProductIds = async (req, res) => {
  try {
    let bannerIds = await BannerProductIds.findOne({ isActive: true });
    
    if (!bannerIds) {
      // Tạo mới nếu chưa có
      bannerIds = await BannerProductIds.create({
        productIds: [],
        isActive: true,
        maxProducts: 10,
      });
    }
    
    res.status(200).json({
      success: true,
      data: bannerIds,
    });
  } catch (error) {
    console.error("Error fetching banner product IDs:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tải banner product IDs",
    });
  }
};

// Add product ID to banner (Admin only)
const addProductIdToBanner = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID là bắt buộc",
      });
    }

    let bannerIds = await BannerProductIds.findOne({ isActive: true });
    
    if (!bannerIds) {
      bannerIds = await BannerProductIds.create({
        productIds: [productId],
        isActive: true,
        maxProducts: 10,
      });
    } else {
      // Kiểm tra xem ID đã tồn tại chưa
      if (bannerIds.productIds.includes(productId)) {
        return res.status(400).json({
          success: false,
          message: "Product ID đã tồn tại trong banner",
        });
      }
      
      // Kiểm tra số lượng tối đa
      if (bannerIds.productIds.length >= bannerIds.maxProducts) {
        return res.status(400).json({
          success: false,
          message: `Đã đạt số lượng tối đa (${bannerIds.maxProducts}) sản phẩm trong banner`,
        });
      }
      
      bannerIds.productIds.push(productId);
      await bannerIds.save();
    }
    
    res.status(200).json({
      success: true,
      message: "Đã thêm product ID vào banner thành công!",
      data: bannerIds,
    });
  } catch (error) {
    console.error("Error adding product ID to banner:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm product ID vào banner: " + error.message,
    });
  }
};

// Remove product ID from banner (Admin only)
const removeProductIdFromBanner = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const bannerIds = await BannerProductIds.findOne({ isActive: true });
    
    if (!bannerIds) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy banner product IDs",
      });
    }
    
    const index = bannerIds.productIds.indexOf(productId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product ID không tồn tại trong banner",
      });
    }
    
    bannerIds.productIds.splice(index, 1);
    await bannerIds.save();
    
    res.status(200).json({
      success: true,
      message: "Đã xóa product ID khỏi banner thành công!",
      data: bannerIds,
    });
  } catch (error) {
    console.error("Error removing product ID from banner:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa product ID khỏi banner: " + error.message,
    });
  }
};

// Update banner product IDs order (Admin only)
const updateBannerProductIdsOrder = async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: "Product IDs phải là một mảng",
      });
    }
    
    let bannerIds = await BannerProductIds.findOne({ isActive: true });
    
    if (!bannerIds) {
      bannerIds = await BannerProductIds.create({
        productIds: productIds,
        isActive: true,
        maxProducts: 10,
      });
    } else {
      bannerIds.productIds = productIds;
      await bannerIds.save();
    }
    
    res.status(200).json({
      success: true,
      message: "Đã cập nhật thứ tự banner product IDs thành công!",
      data: bannerIds,
    });
  } catch (error) {
    console.error("Error updating banner product IDs order:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật thứ tự banner product IDs: " + error.message,
    });
  }
};

// Save banner products (Admin only)
const saveBannerProducts = async (req, res) => {
  try {
    console.log('Banner controller: Received request');
    console.log('User from middleware:', req.user);
    console.log('Request body:', req.body);
    
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      console.log('Invalid products data:', products);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu sản phẩm không hợp lệ",
      });
    }

    console.log('Products to save:', products);

    // Clear existing banner products
    await BannerProduct.deleteMany({});
    console.log('Cleared existing banner products');

    // Save new banner products
    const bannerProducts = products.map((product, index) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      discount: product.discount,
      image: product.image,
      badge: product.badge,
      buttonText: product.buttonText,
      order: index,
    }));

    const savedProducts = await BannerProduct.insertMany(bannerProducts);
    console.log('Saved banner products:', savedProducts);

    // Also update BannerProductIds collection
    const productIds = products.map(product => product.id);
    let bannerIds = await BannerProductIds.findOne({ isActive: true });
    
    if (!bannerIds) {
      bannerIds = await BannerProductIds.create({
        productIds: productIds,
        isActive: true,
        maxProducts: 10,
      });
    } else {
      bannerIds.productIds = productIds;
      await bannerIds.save();
    }
    
    console.log('Updated banner product IDs:', bannerIds);

    res.status(200).json({
      success: true,
      message: `Đã lưu ${savedProducts.length} sản phẩm vào banner thành công!`,
      data: savedProducts,
      bannerIds: bannerIds,
    });
  } catch (error) {
    console.error("Error saving banner products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lưu banner products: " + error.message,
    });
  }
};

// Clear all banner products (Admin only)
const clearBannerProducts = async (req, res) => {
  try {
    await BannerProduct.deleteMany({});
    
    res.status(200).json({
      success: true,
      message: "Đã xóa tất cả banner products",
    });
  } catch (error) {
    console.error("Error clearing banner products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa banner products",
    });
  }
};

module.exports = {
  getBannerProducts,
  getBannerProductIds,
  addProductIdToBanner,
  removeProductIdFromBanner,
  updateBannerProductIdsOrder,
  saveBannerProducts,
  clearBannerProducts,
}; 