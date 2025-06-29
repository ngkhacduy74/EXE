const { number } = require("joi");
const Product = require("../Model/product.model");
const SearchHistory = require("../Model/searchHistory.model");
const mongoose = require("mongoose");
const { v1 } = require("uuid");
const stripHtmlTags = (str) => str.replace(/<[^>]*>?/gm, "").trim();
const createProduct = async (data, user) => {
  const {
    image,
    video,
    name,
    brand,
    price,
    description,
    size,
    weight,
    status,
    warranty_period,
    business_phone,
    //capacity,
    voltage,
    features,
    quantity,
  } = data;
  console.log("ưehreh", user);
  const newProduct = new Product({
    id: v1(),
    image: image,
    video: video,
    name: name,
    brand: brand,
    price: price,
    description: stripHtmlTags(description),
    size: size,
    weight: weight,
    status: status,
    business_phone: business_phone,
    warranty_period: warranty_period,
    //capacity: capacity,
    voltage: voltage,
    features: features,
    creator: {
      id: user.id,
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
    },
    quantity: quantity,
  });
  try {
    await newProduct.save();
    return {
      success: true,
      message: "Save successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "Save unsuccessfully",
      error: err.message,
      description: "func createProduct",
    };
  }
};
const loadProductByUser = async (userEmail) => {
  console.log("userEmail", userEmail);
  const pipeline = [];
  pipeline.push({ $match: { "creator.email": userEmail } });
  pipeline.push({ $sort: { createdAt: -1 } });
  const listProduct = await Product.aggregate(pipeline);
  if (!listProduct) {
    return {
      success: false,
      message: "Not found Product",
      description: "func loadProductByUser",
    };
  }
  return {
    success: true,
    data: listProduct,
    number: listProduct.length,
  };
};
const getProductById = async (id) => {
  let product = null;
  // Nếu id là ObjectId hợp lệ thì thử tìm theo _id trước
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id);
  }
  // Nếu không tìm thấy theo _id hoặc id không phải ObjectId, thử tìm theo custom id
  if (!product) {
    product = await Product.findOne({ id: id });
  }
  if (!product) {
    return {
      success: false,
      message: "Not found product",
      description: "func getProductById",
    };
  }
  return {
    success: true,
    product,
  };
};
const updateProduct = async (id, data) => {
  const product = await Product.findOneAndUpdate(
    { id: id },
    {
      $set: data,
    },
    {
      new: true,
    }
  );
  if (!product) {
    return {
      success: false,
      message: "Can not update Product",
      description: "func updateProduct",
    };
  }
  return {
    success: true,
    message: "Update Product successful",
    data: product,
  };
};
const deleteProduct = async (idProduct) => {
  const exist = await Product.findOne({ id: idProduct });
  if (!exist) {
    return {
      success: false,
      message: "Not found Product",
      description: "func deleteProduct",
    };
  }
  const deleteProduct = await Product.findOneAndDelete({ id: idProduct });
  if (!deleteProduct) {
    return {
      success: false,
      message: "Delete Product unsuccessful",
      description: "func deleteProduct",
    };
  }
  return {
    success: true,
    message: "Delete Product successful",
  };
};
const loadProductStatus = async (status) => {
  const pipeline = [];
  pipeline.push({ $match: { status: status } });
  pipeline.push({ $sort: { createdAt: -1 } });
  pipeline.push({ $limit: 5 });
  const listProduct = Product.aggregate(pipeline);
  return listProduct;
};
const loadAllProduct = async () => {
  const pipeline = [];
  pipeline.push({ $match: {} });
  pipeline.push({ $sort: { createdAt: -1 } });
  const product = await Product.aggregate(pipeline);
  if (!product) {
    return {
      success: false,
      data: null,
      message: "Not found Product",
      description: "func loadAllProduct",
    };
  }
  return { success: true, data: product };
};
const searchProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      status,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const userId = req.user?.id; // Có thể null nếu chưa đăng nhập

    // Build search query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute search
    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    // Lưu lịch sử tìm kiếm nếu user đã đăng nhập
    if (userId && search) {
      try {
        const searchData = {
          searchQuery: search.toLowerCase(),
          searchType: "product",
          searchResults: products.map((product) => ({
            productId: product._id,
          })),
          category,
          filters: {
            priceRange: {
              min: minPrice ? parseFloat(minPrice) : null,
              max: maxPrice ? parseFloat(maxPrice) : null,
            },
            brand: brand ? [brand] : [],
            status,
          },
        };

        // Kiểm tra xem từ khóa này đã được tìm kiếm trước đó chưa
        let existingSearch = await SearchHistory.findOne({
          userId,
          searchQuery: search.toLowerCase(),
          searchType: "product",
        });

        if (existingSearch) {
          // Nếu đã tồn tại, tăng số lần tìm kiếm và cập nhật thời gian
          existingSearch.searchCount += 1;
          existingSearch.lastSearched = new Date();
          existingSearch.searchResults = searchData.searchResults;
          existingSearch.category = category || existingSearch.category;
          existingSearch.filters = searchData.filters;

          await existingSearch.save();
        } else {
          // Nếu chưa tồn tại, tạo mới
          const newSearchHistory = new SearchHistory({
            userId,
            ...searchData,
          });
          await newSearchHistory.save();
        }
      } catch (error) {
        console.error("Error saving search history:", error);
        // Không throw error vì đây không phải lỗi nghiêm trọng
      }
    }

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi tìm kiếm sản phẩm",
    });
  }
};
const getProductByObjectId = async (objectId) => {
  const product = await Product.findById(objectId);
  if (!product) {
    return {
      success: false,
      message: "Not found product",
      description: "func getProductByObjectId",
    };
  }
  return {
    success: true,
    product,
  };
};
module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductStatus,
  getProductById,
  getProductByObjectId,
  loadAllProduct,
  loadProductByUser,
  searchProducts,
};
