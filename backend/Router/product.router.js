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
} = require("../Controller/product.controller");
const { verifyAdmin } = require("../Middleware/auth.middleware");
router.post(
  "/createProduct",
  productMiddleware.productMiddleware,
  verifyAdmin,
  async (req, res) => {
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

router.get("/status/:status", verifyAdmin, async (req, res) => {
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
router.get("/:id", async (req, res) => {
  const result = await getProductById(req.params.id);
  if (result.success === false) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
router.get("/", async (req, res) => {
  const result = await loadAllProduct();
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
module.exports = router;
