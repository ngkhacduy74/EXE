const express = require("express");
const router = express.Router();
const productMiddleware = require("../Middleware/index");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  loadProductStatus,
  loadAllProduct,
} = require("../Controller/product.controller");
router.post(
  "/createProduct",
  productMiddleware.productMiddleware,
  async (req, res) => {
    const result = await createProduct(req.body);
    if (result.success === false) {
      return res.status(500).json(result);
    }
    res.status(200).json(result);
  }
);
router.get("/:id", async (req, res) => {
  const result = await updateProduct(req.params.id);
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
router.delete("/:id", async (req, res) => {
  const result = await deleteProduct(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
module.exports = router;
