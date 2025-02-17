const express = require("express");
const ProductModel = require("../db/product.models");

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await ProductModel.find();
      res.status(200).json({ data: products });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  }

  async getProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json({ data: product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, category, price, stock } = req.body;

      if (!name || !category || !price || !stock) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const product = new ProductModel({ name, category, price, stock });
      await product.save();

      res
        .status(201)
        .json({ message: "Product created successfully", data: product });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { name, category, price, stock } = req.body;
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.name = name || product.name;
      product.category = category || product.category;
      product.price = price || product.price;
      product.stock = stock || product.stock;

      await product.save();
      res
        .status(200)
        .json({ message: "Product updated successfully", data: product });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;

      const product = await ProductModel.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  }
}

module.exports = new ProductController();
