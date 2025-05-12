const User = require("../Model/user.model");
const { v1 } = require("uuid");
const getAllUser = async () => {
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
  const skip = 0;
  const limit = 10;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });
  const data = await User.aggregate(pipeline);
  console.log("jasdads", data);
  if (!data) {
    return {
      success: false,
      message: "Không lấy được tất cả user",
    };
  }
  return { success: true, data };
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

module.exports = { getAllUser, getUserById };
