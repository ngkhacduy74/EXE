const Post = require("../Model/post.model");
const { v1 } = require("uuid");
const { describe } = require("../Validator/user.validator");
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
const deletePost = async (id) => {
  const delete_post = await Post.findOneAndDelete(id);
  if (!delete_post) {
    return {
      success: false,
      message: "delete unsuccessful",
      description: "func deletePost",
    };
  }
  return {
    success: true,
    message: "delete successful",
  };
};
const updatePost = async (params) => {
  const updatedPost = await Post.findByIdAndUpdate(
    params.id,
    {
      category: params.category,
      image: params.image,
      video: params.video,
      status: params.status,
      title: params.title,
      user_position: params.user_position,
      address: params.address,
      description: params.description,
      condition: params.condition,
      seller: {
        id: params.seller?.id,
        fullname: params.seller?.fullname,
        phone: params.seller?.phone,
        email: params.seller?.email,
      },
    },
    { new: true }
  );

  return { success: true, data: updatePost };
};

module.exports = { createPost, updatePost, deletePost };
