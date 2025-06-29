const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    searchQuery: {
      type: String,
      required: true,
      trim: true,
    },
    searchType: {
      type: String,
      enum: ["product", "post", "general"],
      default: "product",
    },
    searchResults: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
        },
      },
    ],
    searchCount: {
      type: Number,
      default: 1,
    },
    lastSearched: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      trim: true,
    },
    filters: {
      priceRange: {
        min: Number,
        max: Number,
      },
      brand: [String],
      status: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tối ưu query
searchHistorySchema.index({ userId: 1, lastSearched: -1 });
searchHistorySchema.index({ userId: 1, searchQuery: 1 });
searchHistorySchema.index({ searchQuery: 1, searchCount: -1 });

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
