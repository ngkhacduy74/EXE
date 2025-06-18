const BannerProduct = require("../Model/banner.model");

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

    res.status(200).json({
      success: true,
      message: `Đã lưu ${savedProducts.length} sản phẩm vào banner thành công!`,
      data: savedProducts,
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
  saveBannerProducts,
  clearBannerProducts,
}; 