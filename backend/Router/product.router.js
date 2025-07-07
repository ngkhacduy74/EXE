const express = require("express");
const router = express.Router();
const productMiddleware = require("../Middleware/index");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductStatus,
  loadAllProduct,
  getProductById,
  loadProductByUser,
  searchProducts,
  getProductByObjectId,
} = require("../Controller/product.controller");
const {
  verifyAdmin,
  verifyToken,
  verifyUser,
} = require("../Middleware/auth.middleware");
const { JsonWebTokenError } = require("jsonwebtoken");

// Search products route (optional authentication)
router.get("/search", async (req, res) => {
  try {
    await searchProducts(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post(
  "/createProduct",
  verifyToken,
  productMiddleware.productMiddleware,
  async (req, res) => {
    console.log("req.body", req.user);
    const result = await createProduct(req.body, req.user);
    if (result.success === false) {
      return res.status(500).json(result);
    }
    res.status(200).json(result);
  }
);

router.put("/update/:id", verifyAdmin, async (req, res) => {
  const data = req.body;
  const result = await updateProduct(req.params.id, data);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.get("/status/:status", verifyToken, async (req, res) => {
  try {
    const result = await loadProductStatus(req.params.status);
    if (result.success === false) {
      return res.status(500).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/", async (req, res) => {
  if (
    req.query.search ||
    req.query.category ||
    req.query.brand ||
    req.query.minPrice ||
    req.query.maxPrice ||
    req.query.status
  ) {
    // Nếu có bất kỳ filter nào, gọi searchProducts
    return searchProducts(req, res);
  }
  // Nếu không có filter, trả về tất cả sản phẩm
  const result = await loadAllProduct();
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.get("/user/products", verifyUser, async (req, res) => {
  console.log("req.user", req.user);
  const result = await loadProductByUser(req.user.user.email);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.get("/:id", verifyToken, async (req, res) => {
  const result = await getProductById(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.delete("/:id", verifyAdmin, async (req, res) => {
  const result = await deleteProduct(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.get("/by-objectid/:objectId", verifyToken, async (req, res) => {
  const { objectId } = req.params;
  const result = await getProductByObjectId(objectId);
  if (result.success === false) {
    return res.status(404).json(result);
  }
  res.status(200).json(result);
});

module.exports = router;
