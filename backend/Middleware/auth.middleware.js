const userSchema = require("../Validator/user.validator");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
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
const token = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("87qweh", authHeader);

  const token = authHeader.split(" ")[1];

  try {
    console.log("123");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("1ieuhaiohds", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
      error: err.message,
    });
  }
};
module.exports = {
  validateUser,
  verifyAdmin,
  token,
};
