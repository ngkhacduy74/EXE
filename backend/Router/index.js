const express = require("express");
const ProductController = require("../Controller/ProductController");
const authRouter = require("./auth.route");
const fileRouter = require("./file.router");

module.exports = (app) => {
  // Attach authentication and file routes
  app.use("/auth", authRouter);
  app.use("/file", fileRouter);

  // Create router instance
  const router = express.Router();

  // Define product routes
  router.get("/products", ProductController.getAllProducts);
  router.get("/products/:id", ProductController.getProduct);
  router.post("/products", ProductController.createProduct);
  router.put("/products/:id", ProductController.updateProduct);
  router.delete("/products/:id", ProductController.deleteProduct);

  // Attach product routes to the app
  app.use("/api", router);
};
