const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const productMiddleware = require("../Middleware/index");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductStatus,
  loadAllProduct,
  getProductById,
} = require("../Controller/product.controller");

router.post(
  "/createProduct",
  productMiddleware.productMiddleware,
  async (req, res) => {
    const authHeader = req.headers.token;
    let decoded;
    try {
      decoded = jwt.verify(authHeader, process.env.JWT_SECRET_KEY);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token đã hết hạn",
        });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(403).json({
          success: false,
          message: "Token không hợp lệ",
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "Lỗi trong quá trình xác thực token",
          error: err.message,
        });
      }
    }
    try {
      const result = await createProduct(req.body, decoded);

      if (result.success === false) {
        return res.status(500).json({
          success: false,
          message: "Tạo sản phẩm thất bại",
          error: result.error || null,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Tạo sản phẩm thành công",
        data: result.data || null,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi máy chủ trong quá trình tạo sản phẩm",
        error: err.message,
      });
    }
  }
);

router.put("/update/:id", async (req, res) => {
  const data = req.body;
  const result = await updateProduct(req.params.id, data);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.get("/status/:status", async (req, res) => {
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
  const result = await loadAllProduct();
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.get("/:id", async (req, res) => {
  const result = await getProductById(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

router.delete("/:id", async (req, res) => {
  const result = await deleteProduct(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
