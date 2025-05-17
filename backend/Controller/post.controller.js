const Post = require("../Model/post.model");
const { v1 } = require("uuid");
const createPost = async (data, token) => {
  const {
    category,
    image,
    video,
    status,
    title,
    user_position,
    address,
    description,
    phone,
    email,
  } = data;
  const seller = token;
  console.log("21812", seller);
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
      seller: {
        id: seller.user.id,
        fullname: seller.user.fullname,
        email: seller.user.email,
        phone: seller.user.phone,
        address: seller.user.address,
        gender: seller.user.gender,
      },
      phone,
      email,

      condition: "Pending",
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

const loadAllPost = async () => {
  const post = await Post.find();
  if (!post) {
    return {
      success: false,
      message: "load all post error",
      description: "func loadAllPost",
    };
  }
  return {
    success: true,
    message: "load all post successfull",
    data: post,
  };
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
const changePostCondition = async (condition, id, token) => {
  try {
    const change = await Post.findOneAndUpdate(
      { id: id },
      {
        $set: {
          condition: condition,
          seller: {
            id: token.user.id,
            fullname: token.user.fullname,
            email: token.user.email,
            phone: token.user.phone,
            address: token.user.address,
            gender: token.user.gender,
          },
        },
      },
      { new: true }
    );

    if (!change) {
      return {
        success: false,
        message: "Can't change the condition of this post",
        description: "func changePostCondition",
      };
    }
    return {
      success: true,
      message: "Change this post successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: "Change post unsuccessfully",
      error: err.message,
    };
  }
};
const getPostByUserId = async (userId) => {
  try {
    const post = await Post.find({ "seller.id": userId });
    if (!post) {
      return {
        success: false,
        message: "Cant get post by user id",
        description: "func getPostByUserId",
      };
    }
    return {
      success: true,
      message: "Get post by user id success",
      data: post,
    };
  } catch (err) {
    return {
      success: false,
      message: "Cant't get post",
      error: err.message,
    };
  }
};
module.exports = {
  createPost,
  updatePost,
  deletePost,
  changePostCondition,
  getPostByUserId,
  loadAllPost,
};
