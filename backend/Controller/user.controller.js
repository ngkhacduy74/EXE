const User = require("../Model/user.model");
const { v1 } = require("uuid");
const getAllUser = async ({ skip = 0, limit = 10 } = {}) => {
  const pipeline = [];
  pipeline.push({ $match: {} });
  pipeline.push({
    $project: {
      _id: 0,
      id: 1,
      fullname: 1,
      email: 1,
      phone: 1,
      address: 1,
      gender: 1,
      role: 1,
      is_active: 1,
      ava_img_url: 1,
      license: 1,
    },
  });

  pipeline.push({
    $sort: { createdAt: -1 },
  });
  pipeline.push({ $skip: Number(skip) });
  pipeline.push({ $limit: Number(limit) });
  const data = await User.aggregate(pipeline);
  const total = await User.countDocuments();
  if (!data) {
    return {
      success: false,
      message: "Không lấy được tất cả user",
    };
  }
  return { success: true, data, total };
};

const getUserById = async (idUser) => {
  const user = await User.find({ id: { $eq: idUser } }).lean();
  if (!user) {
    return {
      success: false,
      message: "Không lấy được user theo id",
    };
  }
  return { success: true, user };
};
const updateUser = async (params) => {
  console.log("params", params);
  const { id, fullname, phone, email, address, gender, ava_img_url } = params;
  try {
    const updateUser = await User.findOneAndUpdate(
      { id: id },
      { fullname, phone, email, address, gender, ava_img_url },
      { new: true }
    );
    if (!updateUser) {
      return {
        success: false,
        message: "User not found",
        description: "func updateUser",
      };
    }
    return {
      success: true,
      message: "Update user successfully",
      data: updateUser,
    };
  } catch (err) {
    return {
      success: false,
      message: "Error updating user",
      error: err.message,
    };
  }
};

const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id });
    if (!deletedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }
    return {
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    };
  } catch (err) {
    return {
      success: false,
      message: "Error deleting user",
      error: err.message,
    };
  }
};

module.exports = { getAllUser, getUserById, updateUser, deleteUser };
