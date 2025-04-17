const mongoose = require("mongoose");
const peopleSchema = new mongoose.Schema({
  id: { type: String, require: true },
  fullname: { type: String, require: true },
  phone: { type: String, require: true },
  email: { type: String, require: true },
});
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
    seller: { type: peopleSchema, require: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
