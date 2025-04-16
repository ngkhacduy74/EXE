const Post = require("../Model/post.model");
const { v1 } = require("uuid");
const { error } = require("../Validator/user.validator");
const createPost = async (req, res) => {
  const {
    category,
    image,
    video,
    status,
    title,
    user_position,
    address,
    description,
    seller,
  } = req.body;
  const newPost = new Post({
    id: v1(),
    category: category,
    image: image,
    video: video,
    status: status,
    title: title,
    user_position: user_position,
    address: address,
    description: description,
    seller: seller,
  });
  if (!newPost) {
    throw error("Chưa đăng được Post");
  }
  try {
    await newPost.save();
  } catch (error) {
    return { success: false, message: "Đăng bài thất bại", newPost };
  }

  return { success: true, message: "Đăng bài thành công", newPost };
};
