const User = require("../Model/user.model");
const { v1 } = require("uuid");
const getAllUser = async ({
  skip = 0,
  limit = 10,
  searchTerm,
  statusFilter,
  roleFilter,
} = {}) => {
  console.log("Backend: getAllUser received params:", {
    skip,
    limit,
    searchTerm,
    statusFilter,
    roleFilter,
  });
  const pipeline = [];
  const matchConditions = {};

  if (searchTerm) {
    matchConditions.fullname = { $regex: searchTerm, $options: "i" };
  }

  if (statusFilter !== "All" && statusFilter !== undefined) {
    matchConditions.is_active = statusFilter === "Active" ? "true" : "false";
  }

  if (roleFilter !== "All" && roleFilter !== undefined) {
    matchConditions.role = roleFilter;
  }

  pipeline.push({ $match: matchConditions });
  pipeline.push({
    $project: {
      // _id: 0, // Removed to allow _id to be used for stable sorting
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
    $sort: { createdAt: -1, _id: 1 },
  });

  console.log(
    "Backend: Pipeline before skip/limit for total count:",
    JSON.stringify(pipeline)
  );
  // Count total documents before applying skip and limit for pagination
  const totalUsers = await User.aggregate([...pipeline, { $count: "total" }]);
  const total = totalUsers.length > 0 ? totalUsers[0].total : 0;
  console.log("Backend: Calculated total users:", total);

  pipeline.push({ $skip: Number(skip) });
  pipeline.push({ $limit: Number(limit) });

  console.log(
    "Backend: Final pipeline before aggregation:",
    JSON.stringify(pipeline)
  );
  const data = await User.aggregate(pipeline);
  console.log(
    "Backend: Data returned by aggregation:",
    data.map((u) => u.fullname)
  ); // Log full names for brevity

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
