const mongoose = require("mongoose");
const peopleSchema = new mongoose.Schema(
  {
    id: { type: String, require: true },
    fullname: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    address: { type: String, require: true },
    gender: { type: String, require: true },
    ava_img_url: { type: String, require: false },
  },
  { _id: false }
);
const postSchema = new mongoose.Schema(
  {
    id: { type: String, require: true },
    category: { type: String, require: true },
    image: [{ type: String, require: true }],
    video: [{ type: String, require: true }],
    status: { type: String, require: true, enum: ["New", "SecondHand"] },
    title: { type: String, require: true },
    user_position: {
      type: String,
      require: true,
      enum: ["Newbie", "Professional"],
    },
    address: { type: String, require: true },
    description: { type: String, require: true },
    content: { type: String, require: false },
    seller: { type: peopleSchema, require: true },
    condition: {
      type: String,
      require: false,
      enum: ["Pending", "Active", "Inactive", "Reject"],
      default: "Pending"
    },
    comments: [
      {
        user: { type: String, require: true }, // userId hoặc tên
        content: { type: String, require: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    likes: [{ type: String }], // userId
    favorites: [{ type: String }], // userId
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
