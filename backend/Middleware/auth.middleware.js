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

const verifyUser = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Thiếu token hoặc định dạng sai" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.user.role !== "User") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện chức năng này",
      });
    }
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

const verifyAdmin = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Thiếu token hoặc định dạng sai" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện chức năng này",
      });
    }
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
  verifyUser,
};
