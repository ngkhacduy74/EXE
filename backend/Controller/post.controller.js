const Post = require("../Model/post.model");
const { v1 } = require("uuid");
const User = require("../Model/user.model");
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
    content,
    phone,
    email,
  } = data;
  const seller = token;
  // Lấy user từ DB để lấy đủ thông tin seller
  let sellerDb = null;
  try {
    sellerDb = await User.findOne({ id: seller.user.id });
  } catch (e) {}
  const sellerInfo = sellerDb
    ? {
        id: sellerDb.id,
        fullname: sellerDb.fullname,
        email: sellerDb.email,
        phone: sellerDb.phone,
        address: sellerDb.address,
        gender: sellerDb.gender,
        ava_img_url: sellerDb.ava_img_url,
      }
    : {
        id: seller.user.id,
        fullname: seller.user.fullname,
        email: seller.user.email,
        phone: seller.user.phone,
        address: seller.user.address,
        gender: seller.user.gender,
        ava_img_url: seller.user.ava_img_url || "",
      };
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
      content,
      seller: sellerInfo,
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
const getPostById = async (id) => {
  let post = await Post.findOne({ id: id });
  if (!post) {
    // Thử tìm theo _id (ObjectId)
    try {
      post = await Post.findById(id);
    } catch (e) {
      // Không phải ObjectId hợp lệ, bỏ qua
    }
  }
  if (!post) {
    return {
      success: false,
      message: "Không tìm thấy bài đăng",
      description: "func getPostById",
    };
  }
  return {
    success: true,
    message: "Đã lấy thành công post",
    data: post,
  };
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
const updatePost = async (body, seller) => {
  console.log("seller", seller);
  console.log("params111111", body);
  const updatedPost = await Post.findOneAndUpdate(
    { id: body.id },
    {
      category: body.category,
      image: body.image,
      video: body.video,
      status: body.status,
      title: body.title,
      user_position: body.user_position,
      address: body.address,
      description: body.description,
      content: body.content,
      condition: body.condition,
      seller: {
        id: seller?.id,
        fullname: seller?.fullname,
        phone: seller?.phone,
        email: seller?.email,
      },
    },
    { new: true }
  );
  console.log("updatedPost", updatedPost);

  return { success: true, data: updatedPost };
};
const changePostCondition = async (condition, id, token) => {
  try {
    console.log("Attempting to change condition for post:", { id, condition });

    const change = await Post.findByIdAndUpdate(
      id,
      {
        condition: condition,
      },
      { new: true }
    );

    if (!change) {
      console.log("Post not found with id:", id);
      return {
        success: false,
        message: "Can't change the condition of this post - Post not found",
        description: "func changePostCondition",
      };
    }

    console.log("Successfully updated post:", change);
    return {
      success: true,
      message: "Change this post successfully",
      data: change,
    };
  } catch (err) {
    console.error("Error in changePostCondition:", err);
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
const addComment = async (postId, user, content) => {
  const post = await Post.findOne({ id: postId });
  if (!post) return { success: false, message: "Không tìm thấy bài viết" };
  post.comments.push({ user, content });
  await post.save();
  return { success: true, comments: post.comments };
};
const toggleLike = async (postId, userId) => {
  const post = await Post.findOne({ id: postId });
  if (!post) return { success: false, message: "Không tìm thấy bài viết" };
  const idx = post.likes.indexOf(userId);
  if (idx === -1) post.likes.push(userId);
  else post.likes.splice(idx, 1);
  await post.save();
  return { success: true, likes: post.likes };
};
const toggleFavorite = async (postId, userId) => {
  const post = await Post.findOne({ id: postId });
  if (!post) return { success: false, message: "Không tìm thấy bài viết" };
  const idx = post.favorites.indexOf(userId);
  if (idx === -1) post.favorites.push(userId);
  else post.favorites.splice(idx, 1);
  await post.save();
  return { success: true, favorites: post.favorites };
};
module.exports = {
  createPost,
  updatePost,
  deletePost,
  changePostCondition,
  getPostByUserId,
  loadAllPost,
  getPostById,
  addComment,
  toggleLike,
  toggleFavorite,
};
