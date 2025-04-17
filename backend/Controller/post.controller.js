const Post = require("../Model/post.model");

const createPost = async (data) => {
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
    phone,
    email,
  } = data;

  try {
    const newPost = new Post({
      id: v1(),
      category,
      image,
      video,
      status,
      title,
      user_position,
      address,
      description,
      seller,
      phone,
      email,
    });

    await newPost.save();

    return {
      success: true,
      message: "Đăng bài thành công",
      post: newPost,
    };
  } catch (error) {
    return {
      success: false,
      message: "Đăng bài thất bại",
      error: error.message,
    };
  }
};
const deletePost = async (params)=>{
  const result = Post.findON
}
module.exports = { createPost };
