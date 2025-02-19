const userSchema = require("../Validator/user.validator");

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ success: false, errors: error.details });
  }
  next();
};
const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Bạn không có quyền truy cập!" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Lỗi kiểm tra quyền truy cập!" });
  }
};
module.exports = {
  validateUser,
  verifyAdmin,
};
